"use client";

export default function Filters({ onFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full">
      <input
        type="search"
        placeholder="Buscar por nombre..."
        className="w-full sm:w-auto border border-border rounded-lg px-4 py-2 text-card-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        onChange={(e) => onFilter("title", e.target.value)}
      />

      <select
        onChange={(e) => onFilter("platform", e.target.value)}
        className="w-full sm:w-auto border border-border rounded-lg px-4 py-2 text-card-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Plataforma</option>
        <option value="pc">PC</option>
        <option value="browser">Browser</option>
      </select>

      <select
        onChange={(e) => onFilter("category", e.target.value)}
        className="w-full sm:w-auto border border-border rounded-lg px-4 py-2 text-card-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
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
