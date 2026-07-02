"""
Orbitra Orbital Engine — Python microservice for satellite propagation.

Provides high-precision orbital calculations using the SGP4 model
via the Skyfield library. Handles batch propagation, pass prediction,
and ground footprint calculations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime

app = FastAPI(
    title="Orbitra Orbital Engine",
    description="High-precision satellite propagation and orbital calculations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ─────────────────────────────────────

class TLEData(BaseModel):
    name: str
    line1: str
    line2: str
    norad_id: int


class PropagateRequest(BaseModel):
    tles: List[TLEData] = Field(..., max_length=1000)
    timestamp: Optional[datetime.datetime] = None


class GeodeticPosition(BaseModel):
    latitude: float
    longitude: float
    altitude: float  # km


class PropagateResult(BaseModel):
    norad_id: int
    name: str
    position: GeodeticPosition
    velocity: float  # km/s
    heading: Optional[float] = None


class PropagateResponse(BaseModel):
    positions: List[PropagateResult]
    timestamp: str
    count: int
    propagated: int


class PassRequest(BaseModel):
    tle: TLEData
    latitude: float
    longitude: float
    look_ahead_hours: int = Field(default=24, ge=1, le=72)
    min_elevation: float = Field(default=10.0, ge=0, le=90)


class PassResult(BaseModel):
    norad_id: int
    name: str
    start_time: str
    end_time: str
    max_elevation: float
    direction: str
    visible: bool


class FootprintRequest(BaseModel):
    altitude_km: float
    latitude: float
    longitude: float
    num_points: int = Field(default=64, ge=16, le=256)


class FootprintResult(BaseModel):
    points: List[GeodeticPosition]


# ── Routes ─────────────────────────────────────

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "orbital-engine", "version": "1.0.0"}


@app.post("/propagate", response_model=PropagateResponse)
async def propagate(request: PropagateRequest):
    """
    Batch propagate TLEs to a specific timestamp.
    Returns geodetic positions and velocities for all valid satellites.
    """
    from skyfield.api import load, EarthSatellite
    from skyfield.timelib import Time

    ts = load.timescale()

    target_time = request.timestamp or datetime.datetime.now(datetime.timezone.utc)
    t = ts.from_datetime(target_time.replace(tzinfo=datetime.timezone.utc))

    results = []

    for tle_data in request.tles:
        try:
            satellite = EarthSatellite(tle_data.line1, tle_data.line2, tle_data.name, ts)
            geocentric = satellite.at(t)

            # Get subpoint (geodetic position)
            subpoint = geocentric.subpoint()

            # Calculate velocity
            velocity = geocentric.velocity.km_per_s

            speed = (
                (velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2) ** 0.5
                if velocity is not None
                else 7.5
            )

            results.append(
                PropagateResult(
                    norad_id=tle_data.norad_id,
                    name=tle_data.name,
                    position=GeodeticPosition(
                        latitude=subpoint.latitude.degrees,
                        longitude=subpoint.longitude.degrees,
                        altitude=subpoint.elevation.km,
                    ),
                    velocity=round(speed, 3),
                )
            )
        except Exception:
            # Skip satellites that fail to propagate
            continue

    return PropagateResponse(
        positions=results,
        timestamp=target_time.isoformat(),
        count=len(request.tles),
        propagated=len(results),
    )


@app.post("/footprint", response_model=FootprintResult)
async def footprint(request: FootprintRequest):
    """
    Calculate satellite ground footprint polygon.
    """
    import math

    R = 6371.0  # Earth radius in km
    sat_r = R + request.altitude_km

    # Angular radius of footprint
    alpha = math.acos(R / sat_r)

    sat_lat = math.radians(request.latitude)
    sat_lon = math.radians(request.longitude)

    points = []

    for i in range(request.num_points):
        azimuth = 2 * math.pi * i / request.num_points

        lat = math.asin(
            math.sin(sat_lat) * math.cos(alpha)
            + math.cos(sat_lat) * math.sin(alpha) * math.cos(azimuth)
        )

        d_lon = math.atan2(
            math.sin(azimuth) * math.sin(alpha) * math.cos(sat_lat),
            math.cos(alpha) - math.sin(sat_lat) * math.sin(lat),
        )

        lon = sat_lon + d_lon

        points.append(
            GeodeticPosition(
                latitude=math.degrees(lat),
                longitude=math.degrees(lon),
                altitude=0,
            )
        )

    return FootprintResult(points=points)


# ── Main ───────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
