function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Find a service",
      description:
        "Browse services offered by students on your campus and find what you need.",
    },
    {
      number: "02",
      title: "Send a request",
      description:
        "Choose a provider, share what you need, and send a service request.",
    },
    {
      number: "03",
      title: "Get it done",
      description:
        "Track your request from acceptance to completion and leave a review.",
    },
  ];

  return (
    <section className="how-section">
      <div className="how-header">
        <p className="section-eyebrow">SIMPLE BY DESIGN</p>

        <h2>
          From request
          <br />
          <span>to done.</span>
        </h2>

        <p>
          Everything you need to connect with skilled students
          and get things done on campus.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((step) => (
          <div className="step" key={step.number}>
            <span className="step-number">{step.number}</span>

            <div className="step-line" />

            <h3>{step.title}</h3>

            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;