import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-24" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <span className="text-2xl font-black tracking-tight">
              orbi<span className="text-primary">.</span>
            </span>
            <p className="mt-3 text-sm text-background/60 leading-relaxed">
              A plataforma de employer branding e vagas para startups e empresas de tech no Brasil.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/40 mb-4">Candidatos</h4>
            <ul className="space-y-2.5">
              {["Buscar Vagas", "Empresas", "Conteúdo", "Criar Perfil"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-background/70 hover:text-background cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/40 mb-4">Empresas</h4>
            <ul className="space-y-2.5">
              {["Postar Vagas", "Perfil Empresarial", "Employer Branding", "Planos e Preços"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-background/70 hover:text-background cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/40 mb-4">Orbi</h4>
            <ul className="space-y-2.5">
              {["Sobre nós", "Blog", "Imprensa", "Contato", "Termos de uso", "Privacidade"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-background/70 hover:text-background cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © 2024 Orbi. Todos os direitos reservados.
          </p>
          <p className="text-sm text-background/40">
            Feito com ❤️ para o ecossistema tech brasileiro
          </p>
        </div>
      </div>
    </footer>
  );
}
