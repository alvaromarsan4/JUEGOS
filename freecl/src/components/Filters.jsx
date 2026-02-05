"use client";

export default function Filters({ onFilter }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full bg-card p-4 rounded-xl border border-border mt-4 mb-4">
      <div className="relative flex-grow">
        <input
          type="search"
          placeholder="Buscar por nombre..."
          className="w-full bg-muted text-foreground border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={(e) => onFilter("title", e.target.value)}
        />
      </div>

      <select
        className="w-full md:w-auto bg-muted text-foreground border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
        onChange={(e) => onFilter("platform", e.target.value)}
      >
        <option value="">Plataforma</option>
        <option value="pc">PC</option>
        <option value="browser">Browser</option>
      </select>

      <select
        className="w-full md:w-auto bg-muted text-foreground border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
        onChange={(e) => onFilter("category", e.target.value)}
      >
        <option value="">Género</option>
        <option value="action">Action</option>
        <option value="arpg">ARPG</option>
        <option value="Dungeon Crawler">Dungeon Crawler</option>
        <option value="fantasy">Fantasy</option>
        <option value="fighting">Fighting</option>
        <option value="MMO">MMO</option>
        <option value="MMOARPG">MMOARPG</option>
        <option value="mmorpg">MMORPG</option>
        <option value="MOBA">MOBA</option>
        <option value="Racing">Racing</option>
        <option value="RPG">RPG</option>
        <option value="shooter">Shooter</option>
        <option value="Social">Social</option>
        <option value="Sports">Sports</option>
        <option value="Strategy">Strategy</option>
      </select>
    </div>
  );
}
