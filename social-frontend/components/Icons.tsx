import { SVGProps } from 'react';

export default function Icons({ icon }: { icon: string }) {
  if (icon === 'chat')
    return (
      <svg
        fill="#000000"
        className="swap-on fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 60"
      >
        <path
          d="M30,1.5c-16.542,0-30,12.112-30,27c0,5.205,1.647,10.246,4.768,14.604c-0.591,6.537-2.175,11.39-4.475,13.689
	c-0.304,0.304-0.38,0.769-0.188,1.153C0.276,58.289,0.625,58.5,1,58.5c0.046,0,0.093-0.003,0.14-0.01
	c0.405-0.057,9.813-1.412,16.617-5.338C21.622,54.711,25.738,55.5,30,55.5c16.542,0,30-12.112,30-27S46.542,1.5,30,1.5z"
        />
      </svg>
    );

  if (icon === 'retweet')
    return (
      <svg
        fill="#000000"
        className="swap-on fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 247.235 247.235"
      >
        <g>
          <path
            d="M204.912,183.175h-165.2v-39.771h21.712c2.196,0,4.216-1.199,5.268-3.127s0.966-4.276-0.224-6.122L38.756,91.133
       c-1.104-1.715-3.004-2.751-5.044-2.751s-3.939,1.036-5.044,2.751L0.956,134.154c-1.189,1.846-1.275,4.194-0.224,6.122
       s3.072,3.127,5.268,3.127h21.712v45.771c0,3.313,2.686,6,6,6h171.2c3.313,0,6-2.687,6-6S208.226,183.175,204.912,183.175z
        M33.712,105.462l16.71,25.941h-33.42L33.712,105.462z"
          />
          <path
            d="M246.502,106.958c-1.052-1.928-3.071-3.127-5.268-3.127h-21.712V58.06c0-3.313-2.687-6-6-6h-171.2c-3.313,0-6,2.687-6,6
       s2.687,6,6,6h165.2v45.771c0,3.313,2.687,6,6,6h16.71l-16.71,25.941l-22.669-35.19c-1.794-2.786-5.506-3.59-8.293-1.795
       c-2.786,1.794-3.59,5.508-1.795,8.293l27.713,43.021c1.104,1.715,3.004,2.751,5.044,2.751s3.939-1.036,5.044-2.751l27.712-43.021
       C247.468,111.234,247.554,108.886,246.502,106.958z"
          />
        </g>
      </svg>
    );

  if (icon === 'liked')
    return (
      <svg
        className="swap-on fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#f97316"
        />
      </svg>
    );

  if (icon === 'unliked')
    return (
      <svg
        className="swap-off fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="none"
          stroke="#78716c"
          strokeWidth="2"
        />
      </svg>
    );

  if (icon === 'followed')
    return (
      <svg
        className="swap-on fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          fill="#10b981"
        />
      </svg>
    );

  if (icon === 'unfollowed')
    return (
      <svg
        className="swap-off fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          fill="none"
          stroke="#78716c"
          strokeWidth="2"
        />
      </svg>
    );

  if (icon === 'pinned')
    return (
      <svg
        className="swap-on fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M3,21H21V19H3V21ZM12,17L15,3H9L12,17Z" fill="#8b5cf6" />
      </svg>
    );

  if (icon === 'unpinned')
    return (
      <svg
        className="swap-off fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M3,21H21V19H3V21ZM12,17L15,3H9L12,17Z"
          fill="none"
          stroke="#78716c"
          strokeWidth="2"
        />
      </svg>
    );

  if (icon === 'sun') {
    return (
      <svg
        className="swap-off fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>
    );
  }

  if (icon === 'moon') {
    return (
      <svg
        className="swap-on fill-current w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
      </svg>
    );
  }

  if (icon === 'menu') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h7"
        />
      </svg>
    );
  }

  if (icon === 'diese') {
    return (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        className="fill-current"
      >
        <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
      </svg>
    );
  }

  if (icon === 'loader-on') {
    <svg
      className="animate-spin w-5 h-5 mr-1 swap-on"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20"
      />
    </svg>;
  }

  if (icon === 'loader-off') {
    <svg
      className="animate-spin w-5 h-5 mr-1 swap-off"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20"
      />
    </svg>;
  }

  return null;
}
