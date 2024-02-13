export default function HeroConnected() {
  return (
    <div className="hero min-h-screen bg-base-600">
      <div className="hero-content flex-col lg:flex-row">
        <img
          src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-4xl font-bold">
            Decentralized Social Networks Maker!
          </h1>
          <p className="py-6"></p>
          <button className="btn btn-primary">Create</button>
        </div>
      </div>
    </div>
  );
}
