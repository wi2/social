export default function Hero() {
  return (
    <div className="hero min-h-screen bg-base-600">
      <div className="bg-primary-content bg-opacity-70 hero-content flex-col lg:flex-row">
        <div>
          <h1 className="text-4xl font-bold">
            Decentralized Social Networks Maker!
          </h1>
          <p className="py-6">
            Welcome to our Private Network Creation Service, where you have the
            power to build your own decentralized social network. Tailored for
            privacy and exclusivity, our platform offers key functionalities
            like personalized user management, secure and private messaging, and
            unique content-sharing features. Establish your exclusive community,
            control your interactions, and experience the unparalleled security
            of blockchain technology. Join us in pioneering a new era of private
            social networking, redefined by user-centric control, privacy, and
            innovation.
          </p>
          <a href="/create" className="btn btn-primary">
            Create your social network project
          </a>
        </div>
      </div>
    </div>
  );
}
