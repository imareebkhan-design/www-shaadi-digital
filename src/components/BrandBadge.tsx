import logo from "@/assets/shaadi-digital-logo.svg";

const BrandBadge = () => (
  <a
    href="https://shaadi.digital"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 bg-primary px-3 py-1.5 rounded-lg shadow-md hover:bg-primary/90 transition-colors no-underline"
  >
    <img src={logo} alt="Shaadi.Digital" className="h-3.5 w-auto brightness-0 invert" />
  </a>
);

export default BrandBadge;
