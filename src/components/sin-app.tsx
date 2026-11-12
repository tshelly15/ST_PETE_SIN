import { useMemo, useState } from "react";
import {
  Clock,
  ExternalLink,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { FeatureCollection, Point } from "geojson";
import { geo } from "@/data/geo";
import { places, type Place, type SpecialDay, type Weekday } from "@/data/places";
import {
  WEEKDAYS,
  bestDiscount,
  directionsUrl,
  facebookUrl,
  formatHours,
  googleMapsUrl,
  hasSpecialOn,
  haversine,
  offersOn,
  weekdayLabel,
  weekdayNow,
} from "@/lib/offers";
import { SinMap, flyTarget } from "@/components/sin-map";

type SortKey = "name" | "name-desc" | "discount" | "nearest";
type DayFilter = "all" | "today" | Weekday;

type Located = Place & {
  lat?: number;
  lng?: number;
  address?: string;
  hours?: string | null;
  website?: string | null;
};

const DAY_LABEL: Record<SpecialDay, string> = {
  everyday: "Every day",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const SORTS: { id: SortKey; label: string }[] = [
  { id: "name", label: "Name, A–Z" },
  { id: "name-desc", label: "Name, Z–A" },
  { id: "discount", label: "Biggest discount" },
  { id: "nearest", label: "Nearest" },
];

const DOWNTOWN = { lat: 27.771, lng: -82.637 };

function enrich(): Located[] {
  return places.map((place) => {
    const hit = geo[place.id];
    return {
      ...place,
      lat: hit?.lat,
      lng: hit?.lng,
      address: hit?.address,
      hours: hit?.hours ?? null,
      phone: place.phone ?? hit?.phone ?? undefined,
      website: hit?.website ?? null,
    };
  });
}

export function SinApp() {
  const today = weekdayNow();
  const catalog = useMemo(enrich, []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DayFilter>("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [menuOpen, setMenuOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[] | null>(null);
  const [fromList, setFromList] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locNote, setLocNote] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [fly, setFly] = useState<ReturnType<typeof flyTarget> | null>(null);

  const activeDay: Weekday | null = filter === "all" ? null : filter === "today" ? today : filter;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const origin = userLoc ?? DOWNTOWN;
    const rows = catalog.filter((place) => {
      if (activeDay && !hasSpecialOn(place, activeDay)) return false;
      if (!q) return true;
      const blob = [
        place.name,
        place.area,
        place.address ?? "",
        ...place.specials.map((s) => s.offer),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
    const scoreDay = activeDay ?? today;
    rows.sort((a, b) => {
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "discount") {
        const delta = bestDiscount(b, scoreDay) - bestDiscount(a, scoreDay);
        if (delta !== 0) return delta;
        return a.name.localeCompare(b.name);
      }
      if (sort === "nearest") {
        const da = a.lat == null ? Infinity : haversine(origin.lat, origin.lng, a.lat, a.lng!);
        const db = b.lat == null ? Infinity : haversine(origin.lat, origin.lng, b.lat, b.lng!);
        if (da !== db) return da - db;
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
    return rows;
  }, [activeDay, catalog, query, sort, today, userLoc]);

  const data = useMemo<FeatureCollection<Point>>(() => {
    return {
      type: "FeatureCollection",
      features: filtered
        .filter((place) => place.lat != null && place.lng != null)
        .map((place) => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [place.lng!, place.lat!] },
          properties: {
            id: place.id,
            name: place.name,
            today: hasSpecialOn(place, today) ? 1 : 0,
          },
        })),
    };
  }, [filtered, today]);

  const selected = catalog.find((place) => place.id === selectedId) ?? null;
  const pinned = filtered.filter((place) => place.lat != null).length;
  const unpinned = filtered.length - pinned;

  function locate() {
    if (!navigator.geolocation) {
      setLocNote("Location isn’t available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(next);
        setLocNote(null);
        setFly(flyTarget(next.lng, next.lat));
      },
      () => setLocNote("Location permission was denied. Nearest uses downtown St. Pete."),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  function chooseSort(next: SortKey) {
    setSort(next);
    setMenuOpen(false);
    if (next === "nearest" && !userLoc) locate();
  }

  function openPlace(id: string, list: boolean) {
    const place = catalog.find((item) => item.id === id);
    setSelectedId(id);
    setChoices(null);
    setFromList(list);
    setListOpen(false);
    if (place?.lat != null && place.lng != null) setFly(flyTarget(place.lng, place.lat));
  }

  function onPick(ids: string[]) {
    if (ids.length === 1) openPlace(ids[0], false);
    else setChoices(ids);
  }

  const filterLabel =
    filter === "all" ? "All days" : filter === "today" ? `Today · ${weekdayLabel(today)}` : weekdayLabel(filter);

  return (
    <main className="relative h-dvh overflow-hidden bg-gulf text-ink">
      <SinMap
        data={data}
        selectedId={selectedId}
        flyTo={fly}
        onPick={onPick}
        onReadyChange={setMapReady}
      />

      {!mapReady && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-gulf text-paper">
          <p className="font-display text-2xl">Lining up the pins…</p>
        </div>
      )}

      <header className="safe-top absolute inset-x-0 top-0 z-30 flex items-center gap-2 px-3">
        <form
          className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-paper px-4 shadow-lg"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            setListOpen(true);
            setSelectedId(null);
          }}
        >
          <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
          <label className="sr-only" htmlFor="spot-search">
            Search businesses and specials
          </label>
          <input
            id="spot-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bars, beer, 50% off…"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="text-muted">
              <X className="size-5" />
            </button>
          )}
        </form>
        <button
          type="button"
          aria-label="Sort and filter"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-12 shrink-0 place-items-center rounded-full bg-paper text-ink shadow-lg"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      </header>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 z-30"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-20 right-3 left-3 z-40 rounded-card bg-paper p-4 shadow-xl sm:left-auto sm:w-80">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Show</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterChip
                active={filter === "all"}
                onClick={() => {
                  setFilter("all");
                  setMenuOpen(false);
                }}
                label="All"
              />
              <FilterChip
                active={filter === "today"}
                onClick={() => {
                  setFilter("today");
                  setMenuOpen(false);
                }}
                label="Today"
              />
              {WEEKDAYS.map((day) => (
                <FilterChip
                  key={day.id}
                  active={filter === day.id}
                  onClick={() => {
                    setFilter(day.id);
                    setMenuOpen(false);
                  }}
                  label={day.short}
                />
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold tracking-wide text-muted uppercase">Sort list</p>
            <div className="mt-2 grid gap-1">
              {SORTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseSort(item.id)}
                  className={`rounded-xl px-3 py-2 text-left text-sm ${
                    sort === item.id ? "bg-gulf text-paper" : "hover:bg-paper-2"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Green pins have a special today ({weekdayLabel(today)}). Orange pins are other days.
              List updated April 9, 2026. Be respectful of fellow industry staff.
            </p>
          </div>
        </>
      )}

      <div className="legend-stack">
        <div className="flex items-center gap-3 rounded-full bg-paper px-3 py-2 text-xs shadow-lg">
          <span className="inline-flex items-center gap-1">
            <i className="size-2 rounded-full bg-palm" /> Today
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="size-2 rounded-full bg-ember" /> Other days
          </span>
        </div>
        {filter !== "all" && (
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="w-fit rounded-full bg-gulf px-3 py-2 text-xs text-paper shadow-lg"
          >
            {filterLabel} · clear
          </button>
        )}
      </div>

      <button
        type="button"
        aria-label="Center on my location"
        onClick={locate}
        className="locate-btn grid size-12 place-items-center rounded-full bg-paper text-ink shadow-lg"
      >
        <LocateFixed className="size-5" />
      </button>

      <button
        type="button"
        onClick={() => {
          setListOpen(true);
          setSelectedId(null);
          setChoices(null);
        }}
        className="safe-bottom absolute inset-x-3 bottom-0 z-20 flex items-center justify-between rounded-t-card bg-paper px-4 py-3 shadow-lg md:hidden"
      >
        <span>
          <span className="block font-display text-lg leading-tight">
            {filtered.length} spot{filtered.length === 1 ? "" : "s"}
          </span>
          <span className="text-xs text-muted">
            {filterLabel}
            {sort === "nearest" ? " · nearest" : sort === "discount" ? " · best deal" : ""}
            {unpinned > 0 ? ` · ${unpinned} without a pin` : ""}
          </span>
        </span>
        <span className="text-sm font-semibold text-palm">List</span>
      </button>

      <aside className="absolute top-20 bottom-3 left-3 z-20 hidden w-96 flex-col overflow-hidden rounded-card bg-paper shadow-xl md:flex">
        {selected ? (
          <PlaceDetail
            place={selected}
            today={today}
            origin={userLoc ?? DOWNTOWN}
            located={userLoc != null}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <PlaceList
            places={filtered}
            today={today}
            activeDay={activeDay}
            origin={userLoc ?? DOWNTOWN}
            located={userLoc != null}
            filterLabel={filterLabel}
            onOpen={(id) => openPlace(id, true)}
          />
        )}
      </aside>

      {listOpen && (
        <section className="safe-bottom absolute inset-x-0 bottom-0 z-40 flex max-h-[78dvh] flex-col rounded-t-card bg-paper shadow-xl md:hidden">
          <div className="flex items-center justify-between px-4 pt-3">
            <h2 className="font-display text-xl">{filtered.length} spots</h2>
            <button type="button" aria-label="Close list" onClick={() => setListOpen(false)} className="grid size-11 place-items-center">
              <X className="size-5" />
            </button>
          </div>
          <PlaceList
            places={filtered}
            today={today}
            activeDay={activeDay}
            origin={userLoc ?? DOWNTOWN}
            located={userLoc != null}
            filterLabel={filterLabel}
            onOpen={(id) => openPlace(id, true)}
          />
        </section>
      )}

      {selected && (
        <section className="safe-bottom absolute inset-x-0 bottom-0 z-40 flex max-h-[78dvh] flex-col rounded-t-card bg-paper shadow-xl md:hidden">
          <PlaceDetail
            place={selected}
            today={today}
            origin={userLoc ?? DOWNTOWN}
            located={userLoc != null}
            onBack={() => {
              setSelectedId(null);
              if (fromList) setListOpen(true);
            }}
          />
        </section>
      )}

      {choices && (
        <section className="safe-bottom absolute inset-x-0 bottom-0 z-40 rounded-t-card bg-paper p-4 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-xl">Which spot?</h2>
            <button type="button" aria-label="Close" onClick={() => setChoices(null)} className="grid size-11 place-items-center">
              <X className="size-5" />
            </button>
          </div>
          <ul className="grid gap-2">
            {choices.map((id) => {
              const place = catalog.find((item) => item.id === id);
              if (!place) return null;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => openPlace(id, false)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-paper-2 px-3 py-3 text-left"
                  >
                    <PinDot today={hasSpecialOn(place, today)} />
                    <span className="font-semibold">{place.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {locNote && (
        <p className="absolute top-20 right-3 left-3 z-30 rounded-2xl bg-ink px-3 py-2 text-sm text-paper md:left-auto md:max-w-80">
          {locNote}
        </p>
      )}
    </main>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-full px-3 text-sm ${active ? "bg-palm text-paper" : "bg-paper-2 text-ink"}`}
    >
      {label}
    </button>
  );
}

function PinDot({ today }: { today: boolean }) {
  return <i className={`size-3 shrink-0 rounded-full ${today ? "bg-palm" : "bg-ember"}`} />;
}

function PlaceList({
  places: rows,
  today,
  activeDay,
  origin,
  located,
  filterLabel,
  onOpen,
}: {
  places: Located[];
  today: Weekday;
  activeDay: Weekday | null;
  origin: { lat: number; lng: number };
  located: boolean;
  filterLabel: string;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="px-4 pb-2 text-xs text-muted">{filterLabel}</p>
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        {rows.length === 0 && (
          <li className="px-2 py-8 text-center text-sm text-muted">No spots match that search.</li>
        )}
        {rows.map((place) => {
          const day = activeDay ?? today;
          const offers = offersOn(place, day);
          const miles =
            place.lat == null ? null : haversine(origin.lat, origin.lng, place.lat, place.lng!);
          return (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => onOpen(place.id)}
                className="flex w-full items-start gap-3 rounded-2xl px-2 py-3 text-left hover:bg-paper-2"
              >
                <span className="mt-1">
                  <PinDot today={hasSpecialOn(place, today)} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{place.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {offers[0]?.offer ?? "No special this day"}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {place.lat == null ? "No pin" : miles != null ? `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi` : ""}
                  {!located && place.lat != null ? "" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PlaceDetail({
  place,
  today,
  origin,
  located,
  onBack,
}: {
  place: Located;
  today: Weekday;
  origin: { lat: number; lng: number };
  located: boolean;
  onBack: () => void;
}) {
  const todayOffers = offersOn(place, today);
  const onToday = todayOffers.length > 0;
  const hours = formatHours(place.hours);
  const miles =
    place.lat == null ? null : haversine(origin.lat, origin.lng, place.lat, place.lng!);
  const order: SpecialDay[] = ["everyday", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const grouped = order
    .map((day) => ({ day, items: place.specials.filter((s) => s.day === day) }))
    .filter((group) => group.items.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-start gap-2 px-4 pt-3">
        <button type="button" onClick={onBack} className="grid size-11 shrink-0 place-items-center" aria-label="Back">
          <X className="size-5" />
        </button>
        <div className="min-w-0 flex-1 pt-1">
          <h2 className="font-display text-2xl leading-tight">{place.name}</h2>
          <p className="mt-1 text-sm text-muted">
            {onToday ? `Special today · ${weekdayLabel(today)}` : `No special today · ${weekdayLabel(today)}`}
            {miles != null ? ` · ${miles.toFixed(1)} mi${located ? "" : " from downtown"}` : ""}
          </p>
        </div>
        <span className="mt-2">
          <PinDot today={onToday} />
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-4">
        {onToday && (
          <div className="rounded-2xl bg-palm-2 px-3 py-3">
            <p className="text-xs font-semibold tracking-wide text-palm uppercase">Today</p>
            {todayOffers.map((offer) => (
              <p key={offer.offer} className="mt-1 text-sm leading-relaxed">
                {offer.offer}
              </p>
            ))}
          </div>
        )}

        <div className="mt-4 grid gap-2 text-sm">
          {place.address && (
            <p className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted" />
              <span>{place.address}</span>
            </p>
          )}
          {!place.address && <p className="text-muted">Listed in {place.area}. Pin not matched yet.</p>}
          <p className="flex gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-muted" />
            <span>
              {hours ?? "Hours aren’t on the public map listing. Check Google Maps before you go."}
            </span>
          </p>
          {place.phone && (
            <a className="flex gap-2 font-medium text-gulf" href={`tel:${place.phone.replace(/[^\d+]/g, "")}`}>
              <Phone className="mt-0.5 size-4 shrink-0" />
              {place.phone}
            </a>
          )}
          {place.website && (
            <a className="flex gap-2 font-medium text-gulf" href={place.website} target="_blank" rel="noreferrer">
              <ExternalLink className="mt-0.5 size-4 shrink-0" />
              Website
            </a>
          )}
        </div>

        <h3 className="mt-5 font-display text-lg">All specials</h3>
        <ul className="mt-2 grid gap-2">
          {grouped.map((group) => (
            <li key={group.day} className="rounded-2xl bg-paper-2 px-3 py-2">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">{DAY_LABEL[group.day]}</p>
              {group.items.map((item) => (
                <p key={item.offer} className="mt-1 text-sm leading-relaxed">
                  {item.offer}
                </p>
              ))}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-2">
          {place.lat != null && place.lng != null && (
            <a
              className="inline-flex h-11 items-center gap-2 rounded-full bg-palm px-4 text-sm font-semibold text-paper"
              href={directionsUrl(place.lat, place.lng)}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="size-4" />
              Directions
            </a>
          )}
          <a
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gulf px-4 text-sm font-semibold text-paper"
            href={googleMapsUrl(place.name, place.area, place.address)}
            target="_blank"
            rel="noreferrer"
          >
            Google Maps
          </a>
          <a
            className="inline-flex h-11 items-center gap-2 rounded-full bg-paper-2 px-4 text-sm font-semibold text-ink"
            href={facebookUrl(place.name, place.area)}
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          From the St. Pete Service Industry list, updated April 9, 2026. Deals change — confirm at the
          door and bring proof of employment when a special asks for it. Please be respectful of fellow
          industry staff.
        </p>
      </div>
    </div>
  );
}
