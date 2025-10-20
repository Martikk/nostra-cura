import "./About.css";

export default function About() {
  return (
    <section className="about">
      {/* Заголовок — как в Services */}
      <h1 className="about__title">ABOUT US</h1>

      {/* overlay можно оставить/удалить, он не затемняет, если не используется */}
      <div className="about__overlay" />

      <div className="about__inner">
        <div className="about__card">
          <h2 className="about__subtitle">Our Mission</h2>
          <p className="about__text">
            <em>
              It is our responsibility to help others and leave the world in a better place.
              We aim to accomplish this by removing the stigma and expanding mental health
              awareness in the construction industry. Our goal is to help those in it live
              fulfilling lives. We cannot accomplish this alone. Let’s talk.
            </em>
          </p>
        </div>
      </div>
    </section>
  );
}