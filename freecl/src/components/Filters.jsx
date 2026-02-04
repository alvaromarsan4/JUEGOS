"use client";

export default function Filters({ onFilter }) {
  return (
    <div className="flex gap-4 items-center">
      <input
        type="search"
        placeholder="Buscar por nombre..."
        className="border rounded px-2 py-1"
        onChange={(e) => onFilter("title", e.target.value)}
      />

      <select onChange={(e) => onFilter("platform", e.target.value)}>
        <option value="">Plataforma</option>
        <option value="pc">PC</option>
        <option value="browser">Browser</option>
      </select>

      <select onChange={(e) => onFilter("category", e.target.value)}>
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
