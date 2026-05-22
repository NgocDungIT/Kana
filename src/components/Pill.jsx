export default function Pill({ active, children, onClick }) {
  return (
    <button onClick={onClick} className={"pill " + (active ? "active" : "")}>
      {children}
    </button>
  );
}
