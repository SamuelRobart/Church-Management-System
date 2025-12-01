export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4  w-screen">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} My Company. All rights reserved.</p>
        <div>
          <a href="/privacy" className="mx-2 hover:underline">Privacy Policy</a>
          <a href="/terms" className="mx-2 hover:underline">Terms &amp; Conditions</a>
          <a href="mailto:contact@mycompany.com" className="mx-2 hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
}
