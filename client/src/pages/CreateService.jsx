import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateService() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    
    if (!user) {
  setError("Please log in before creating a service.");
  navigate("/login");
  return;
}
    setLoading(true);
    
    try {
      const response = await fetch(
        "http://localhost:5000/api/services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider_id: user.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: Number(formData.price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      navigate("/services");
    } catch (error) {
      console.error(error);
      setError("Unable to create service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-service-page">
      <section className="create-service-header">
        <p className="section-eyebrow">OFFER YOUR SKILLS</p>

        <h1>Create a service.</h1>

        <p>
          Share your skills with people on your campus.
        </p>
      </section>

      <section className="create-service-card">
        <form
          className="service-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="title">
              Service title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Poster & Social Media Design"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select a category
              </option>

              <option value="Tutoring">
                Tutoring
              </option>

              <option value="Graphic Design">
                Graphic Design
              </option>

              <option value="Photography">
                Photography
              </option>

              <option value="Video Editing">
                Video Editing
              </option>

              <option value="Writing">
                Writing
              </option>

              <option value="Event Assistance">
                Event Assistance
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              placeholder="Describe what you offer..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">
              Price (₹)
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              placeholder="300"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Publishing..."
              : "Publish service"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreateService;