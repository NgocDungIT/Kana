export default function BottomNav({ tabs, current, onChange }) {
  return (
    <nav>
      {tabs.map(([id, label, Icon]) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={current === id ? "active" : ""}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </nav>
  );
}
