import "./StatCard.css";

// tone: default | success | warning | danger
function StatCard({ title, value, description, tone = "default" }) {
  return (
    <article className={`statcard statcard--${tone}`}>
      <h3>{title}</h3>
      <p className="statcard__value">{value}</p>
      {description && <p className="statcard__description">{description}</p>}
    </article>
  );
}

export default StatCard;
