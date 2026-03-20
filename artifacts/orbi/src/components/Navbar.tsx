import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/vagas", label: "Vagas" },
    { href: "/empresas", label: "Empresas" },
    { href: "/artigos", label: "Conteúdo" },
    { href: "/estados/sc", label: "Santa Catarina" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" data-testid="link-logo">
              <span className="text-2xl font-black tracking-tight text-foreground cursor-pointer select-none">
                orbi<span className="text-primary">.</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                  <span
                    className={`text-sm font-medium cursor-pointer transition-colors hover:text-foreground ${
                      location.startsWith(link.href)
                        ? "text-foreground border-b-2 border-primary pb-0.5"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/vagas" data-testid="button-search-nav">
                <Search className="w-4 h-4 mr-1.5" />
                Buscar
              </Link>
            </Button>
            <Button variant="outline" size="sm" data-testid="button-entrar">
              Entrar
            </Button>
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90" data-testid="button-para-empresas">
              Para Empresas
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-2" data-testid="mobile-menu">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="block px-2 py-2 text-sm font-medium text-foreground cursor-pointer hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Entrar</Button>
              <Button size="sm" className="flex-1 bg-foreground text-background">Para Empresas</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
