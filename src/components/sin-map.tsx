import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { FeatureCollection, Point } from "geojson";
import { Minus, Plus } from "lucide-react";

const TILE = 256;
const MIN_ZOOM = 10;
const MAX_ZOOM = 17;

type FlyTarget = { lng: number; lat: number; nonce: number };

type Props = {
  data: FeatureCollection<Point>;
  selectedId: string | null;
  flyTo: FlyTarget | null;
  onPick: (ids: string[]) => void;
  onReadyChange: (ready: boolean) => void;
};

type View = { lng: number; lat: number; zoom: number };

type Spot = { id: string; name: string; lng: number; lat: number; today: boolean };

function clamp(zoom: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

function project(lng: number, lat: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const sin = Math.min(0.9999, Math.max(-0.9999, Math.sin((lat * Math.PI) / 180)));
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
  return { x, y };
}

function unproject(x: number, y: number, zoom: number) {
  const scale = TILE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));
  return { lng, lat };
}

function tilesFor(view: View, width: number, height: number) {
  const z = Math.floor(view.zoom);
  const tilePx = TILE * 2 ** (view.zoom - z);
  const center = project(view.lng, view.lat, view.zoom);
  const originX = center.x - width / 2;
  const originY = center.y - height / 2;
  const n = 2 ** z;
  const x0 = Math.floor(originX / tilePx) - 1;
  const y0 = Math.floor(originY / tilePx) - 1;
  const x1 = Math.floor((originX + width) / tilePx) + 1;
  const y1 = Math.floor((originY + height) / tilePx) + 1;
  const tiles: { key: string; left: number; top: number; size: number; src: string; fallback: string }[] = [];
  for (let ty = y0; ty <= y1; ty++) {
    if (ty < 0 || ty >= n) continue;
    for (let tx = x0; tx <= x1; tx++) {
      const wrapped = ((tx % n) + n) % n;
      tiles.push({
        key: `${z}/${wrapped}/${ty}/${tx}`,
        left: tx * tilePx - originX,
        top: ty * tilePx - originY,
        size: tilePx,
        src: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${ty}/${wrapped}`,
        fallback: `https://tile.openstreetmap.org/${z}/${wrapped}/${ty}.png`,
      });
    }
  }
  return { tiles, originX, originY };
}

export function SinMap({ data, selectedId, flyTo, onPick, onReadyChange }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View>({ lng: -82.655, lat: 27.773, zoom: 11.4 });
  const dragRef = useRef<{
    pointers: Map<number, { x: number; y: number; sx: number; sy: number }>;
    start: View;
    pinch: number | null;
  }>({ pointers: new Map(), start: viewRef.current, pinch: null });
  const [view, setView] = useState<View>(viewRef.current);
  const [size, setSize] = useState({ width: 0, height: 0 });
  viewRef.current = view;

  const spots = useMemo<Spot[]>(
    () =>
      data.features.flatMap((feature) => {
        if (feature.geometry.type !== "Point") return [];
        const [lng, lat] = feature.geometry.coordinates;
        const id = feature.properties?.id;
        if (typeof id !== "string" || lng == null || lat == null) return [];
        return [
          {
            id,
            name: typeof feature.properties?.name === "string" ? feature.properties.name : id,
            lng,
            lat,
            today: feature.properties?.today === 1,
          },
        ];
      }),
    [data],
  );

  useEffect(() => {
    onReadyChange(true);
  }, [onReadyChange]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const current = viewRef.current;
      const nextZoom = clamp(current.zoom - event.deltaY * 0.0016);
      if (nextZoom === current.zoom) return;
      const rect = el.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const center = project(current.lng, current.lat, current.zoom);
      const world = {
        x: center.x - rect.width / 2 + px,
        y: center.y - rect.height / 2 + py,
      };
      const under = unproject(world.x, world.y, current.zoom);
      const moved = project(under.lng, under.lat, nextZoom);
      const nextCenter = unproject(moved.x - px + rect.width / 2, moved.y - py + rect.height / 2, nextZoom);
      setView({ ...nextCenter, zoom: nextZoom });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (!flyTo) return;
    const from = viewRef.current;
    const toZoom = clamp(Math.max(from.zoom, 15));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = rootRef.current?.clientWidth ?? 0;
    const panel = width >= 768 ? 216 : 0;
    const point = project(flyTo.lng, flyTo.lat, toZoom);
    const shifted = unproject(point.x - panel, point.y, toZoom);
    const target = { lng: shifted.lng, lat: shifted.lat, zoom: toZoom };
    if (reduce) {
      setView(target);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 480);
      const eased = 1 - (1 - t) ** 3;
      setView({
        lng: from.lng + (target.lng - from.lng) * eased,
        lat: from.lat + (target.lat - from.lat) * eased,
        zoom: from.zoom + (toZoom - from.zoom) * eased,
      });
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [flyTo]);

  const { tiles, originX, originY } = useMemo(
    () => tilesFor(view, Math.max(size.width, 1), Math.max(size.height, 1)),
    [view, size.width, size.height],
  );

  const markers = useMemo(() => {
    const cell = view.zoom >= 14.5 ? 0 : 52;
    const groups = new Map<string, { spots: Spot[]; x: number; y: number }>();
    for (const spot of spots) {
      const point = project(spot.lng, spot.lat, view.zoom);
      const x = point.x - originX;
      const y = point.y - originY;
      const key = cell === 0 ? spot.id : `${Math.round(x / cell)}:${Math.round(y / cell)}`;
      const group = groups.get(key);
      if (group) {
        group.spots.push(spot);
        group.x = (group.x * (group.spots.length - 1) + x) / group.spots.length;
        group.y = (group.y * (group.spots.length - 1) + y) / group.spots.length;
      } else {
        groups.set(key, { spots: [spot], x, y });
      }
    }
    return [...groups.values()];
  }, [spots, view.zoom, originX, originY]);

  function zoomBy(delta: number) {
    const current = viewRef.current;
    setView({ ...current, zoom: clamp(current.zoom + delta) });
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    const drag = dragRef.current;
    drag.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      sx: event.clientX,
      sy: event.clientY,
    });
    drag.start = viewRef.current;
    drag.pinch = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const point = drag.pointers.get(event.pointerId);
    if (!point) return;
    point.x = event.clientX;
    point.y = event.clientY;
    const points = [...drag.pointers.values()];
    if (points.length >= 2) {
      const dist = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      if (!drag.pinch) drag.pinch = dist || 1;
      const nextZoom = clamp(drag.start.zoom + Math.log2(dist / drag.pinch));
      setView({ lng: drag.start.lng, lat: drag.start.lat, zoom: nextZoom });
      return;
    }
    const dx = point.x - point.sx;
    const dy = point.y - point.sy;
    const start = project(drag.start.lng, drag.start.lat, drag.start.zoom);
    const next = unproject(start.x - dx, start.y - dy, drag.start.zoom);
    setView({ ...next, zoom: drag.start.zoom });
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    dragRef.current.pointers.delete(event.pointerId);
    dragRef.current.pinch = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      ref={rootRef}
      className="map-stage absolute inset-0 overflow-hidden bg-palm-2"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {tiles.map((tile) => (
        <img
          key={tile.key}
          alt=""
          draggable={false}
          className="pointer-events-none absolute max-w-none select-none"
          style={{ left: tile.left, top: tile.top, width: tile.size, height: tile.size }}
          src={tile.src}
          onError={(event) => {
            const img = event.currentTarget;
            if (img.dataset.fallback === "1") return;
            img.dataset.fallback = "1";
            img.src = tile.fallback;
          }}
        />
      ))}
      {markers.map((group) => {
        const single = group.spots.length === 1 ? group.spots[0] : null;
        const today = group.spots.some((spot) => spot.today);
        const selected = group.spots.some((spot) => spot.id === selectedId);
        return (
          <button
            key={single?.id ?? group.spots.map((spot) => spot.id).join("-")}
            type="button"
            className="absolute z-10 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ left: group.x, top: group.y }}
            aria-label={single ? single.name : `${group.spots.length} spots here`}
            onClick={() => {
              if (single) {
                onPick([single.id]);
                return;
              }
              if (view.zoom < 15.5) {
                const meanLng = group.spots.reduce((sum, spot) => sum + spot.lng, 0) / group.spots.length;
                const meanLat = group.spots.reduce((sum, spot) => sum + spot.lat, 0) / group.spots.length;
                setView({ lng: meanLng, lat: meanLat, zoom: clamp(view.zoom + 1.6) });
                return;
              }
              onPick(group.spots.map((spot) => spot.id));
            }}
          >
            {single ? (
              <span
                className={`size-4 rounded-full border-2 border-paper shadow ${today ? "bg-palm" : "bg-ember"} ${selected ? "ring-4 ring-gulf" : ""}`}
              />
            ) : (
              <span className="grid min-w-7 place-items-center rounded-full border-2 border-paper bg-gulf px-1.5 py-0.5 text-xs font-semibold text-paper shadow">
                {group.spots.length}
              </span>
            )}
          </button>
        );
      })}
      <div className="map-zoom">
        <button type="button" aria-label="Zoom in" className="map-zoom-btn" onClick={() => zoomBy(1)}>
          <Plus className="size-5" />
        </button>
        <button type="button" aria-label="Zoom out" className="map-zoom-btn" onClick={() => zoomBy(-1)}>
          <Minus className="size-5" />
        </button>
      </div>
      <p className="pointer-events-none absolute right-3 bottom-1 z-10 text-[10px] text-ink/80">
        © Esri, TomTom, OSM
      </p>
    </div>
  );
}

export function flyTarget(lng: number, lat: number): FlyTarget {
  return { lng, lat, nonce: Date.now() };
}
