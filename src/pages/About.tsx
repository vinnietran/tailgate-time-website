import { Link } from "react-router-dom";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import { useAuth } from "../hooks/useAuth";

export default function About() {
  const { user } = useAuth();

  return (
    <div className="about-page">
      <PublicTopNav />
      <main>
        <section className="about-intro" aria-labelledby="about-title">
          <p className="about-eyebrow">About TailgateTime</p>
          <div className="about-intro-grid">
            <h1 id="about-title">Good times.<br />Great company.<br /><span>Before kickoff.</span></h1>
            <div className="about-intro-copy">
              <p>The food on the grill. The familiar faces. The friend who always brings someone new. That’s what makes a tailgate worth coming back to.</p>
              <p>TailgateTime helps hosts bring people together and helps fans find a place to join in.</p>
              <Link to="/discover" className="about-text-link">Find your next tailgate <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <figure className="about-photo">
          <img src="/images/bt2.jpg" alt="Fans gathering outside at a Buffalo tailgate" width="2048" height="1536" />
          <figcaption><span>Game day, together.</span><span>From the TailgateTime community</span></figcaption>
        </figure>

        <section className="about-purpose" aria-labelledby="about-purpose-title">
          <div>
            <p className="about-eyebrow">Why we’re here</p>
            <h2 id="about-purpose-title">Make getting together<br />the easy part.</h2>
          </div>
          <div className="about-purpose-copy">
            <p>A great tailgate takes effort. Getting everyone to the right place, sharing the plan, and keeping track of guests shouldn’t take over the day.</p>
            <p>We bring those details into one place, so hosts can focus on welcoming people and fans can spend more time enjoying the experience.</p>
          </div>
        </section>

        <section className="about-people" aria-labelledby="about-people-title">
          <p className="about-eyebrow">A place for your kind of game day</p>
          <h2 id="about-people-title">Your crew. Your traditions.</h2>
          <div className="about-people-row">
            <h3>For the ones who host.</h3>
            <p>Keep it invite-only with your friends, open it up to new fans, or sell tickets to a bigger gathering. Share your story and upcoming events on your own Host Page.</p>
            <Link to={user ? "/tailgates/new" : "/login?mode=signup"} className="about-text-link">Start hosting <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="about-people-row">
            <h3>For the ones who show up.</h3>
            <p>Explore public tailgates, get to know the host, and find the details you need before you head out. Bring your friends or find a new crowd to cheer with.</p>
            <Link to="/discover" className="about-text-link">Explore tailgates <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

        <section className="about-contact">
          <div><p className="about-eyebrow">Let’s talk</p><h2>There’s always room<br />at the tailgate.</h2></div>
          <div><p>Have a question, an idea, or feedback from the lot? We’d like to hear it.</p><a href="/contact.html" className="about-text-link">Get in touch <span aria-hidden="true">↗</span></a></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
