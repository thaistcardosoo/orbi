import { useState, useRef } from "react";
import { X, ChevronRight, ChevronLeft, CheckCircle2, Upload, Globe, Linkedin, Github, Twitter, User, MapPin, Briefcase, Phone, Mail } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@workspace/api-client-react";

const MODALITY_LABELS: Record<string, string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  hibrido: "Híbrido",
};

const CONTRACT_LABELS: Record<string, string> = {
  clt: "CLT",
  pj: "PJ",
  estagio: "Estágio",
  freelancer: "Freelancer",
};

const LEVEL_LABELS: Record<string, string> = {
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  especialista: "Especialista",
};

interface JobContext {
  id: number;
  title: string;
  companyName: string;
  companyLogo?: string | null;
  city: string;
  state: string;
  modality: string;
  contractType: string;
  level: string;
  faq?: FaqItem[] | null;
}

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  job: JobContext;
}

function generateApplicationQuestions(job: JobContext): string[] {
  if (job.faq && job.faq.length >= 2) {
    return job.faq.slice(0, 3).map(item => item.question);
  }

  const questions: string[] = [];

  if (job.level === "junior") {
    questions.push("Descreva um projeto pessoal ou acadêmico que você tem orgulho. O que você aprendeu com ele?");
  } else if (job.level === "pleno") {
    questions.push("Conte sobre um desafio técnico que você superou nos últimos 2 anos e como você o resolveu.");
  } else if (job.level === "senior") {
    questions.push("Descreva uma situação em que você liderou uma decisão técnica importante. Qual foi o impacto?");
  } else if (job.level === "especialista") {
    questions.push("Como você tem contribuído estrategicamente para a evolução técnica de equipes ou organizações anteriores?");
  } else {
    questions.push("Descreva sua experiência mais relevante para esta vaga.");
  }

  if (job.modality === "remoto") {
    questions.push("Você tem experiência trabalhando remotamente? Como é sua rotina e seu ambiente de trabalho em casa?");
  } else if (job.modality === "hibrido") {
    questions.push("Como você organiza sua produtividade em um regime híbrido, equilibrando dias no escritório e em casa?");
  } else {
    questions.push("O que te motiva a trabalhar de forma presencial e como você cultiva a colaboração com o time?");
  }

  if (job.contractType === "pj") {
    questions.push("Você tem empresa aberta (CNPJ) ou está planejando abrir para atuação PJ? Já tem experiência com esse modelo?");
  } else if (job.contractType === "estagio") {
    questions.push("Qual é sua disponibilidade de horas por semana? Você está cursando qual período/semestre atualmente?");
  } else {
    questions.push(`Por que esta oportunidade como ${job.title} na ${job.companyName} faz sentido para o momento atual da sua carreira?`);
  }

  return questions.slice(0, 3);
}

const STEP_LABELS = [
  "Minhas informações",
  "Links",
  "Perguntas",
  "Carta de motivação",
];

interface FormState {
  photo: string | null;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cidade: string;
  situacao: string;
  cvFileName: string | null;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  answers: string[];
  motivacao: string;
  acceptTerms: boolean;
}

interface FieldErrors {
  nome?: string;
  sobrenome?: string;
  email?: string;
  telefone?: string;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0",
            i < current
              ? "bg-primary text-primary-foreground"
              : i === current
                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                : "bg-muted text-muted-foreground"
          )}>
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mx-1 transition-all",
              i < current ? "bg-primary" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function Step1({ form, setForm, errors }: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: FieldErrors;
}) {
  const photoRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, photo: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  }

  function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, cvFileName: file.name }));
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Foto de perfil</p>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
            onClick={() => photoRef.current?.click()}
          >
            {form.photo ? (
              <img src={form.photo} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          <Button variant="outline" size="sm" onClick={() => photoRef.current?.click()} type="button">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            {form.photo ? "Trocar foto" : "Enviar foto"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome" className="text-sm font-medium">
            Nome <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nome"
            value={form.nome}
            onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            placeholder="Ana"
            className={cn("mt-1", errors.nome && "border-red-400 focus-visible:ring-red-400")}
            data-testid="input-nome"
          />
          {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
        </div>
        <div>
          <Label htmlFor="sobrenome" className="text-sm font-medium">
            Sobrenome <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sobrenome"
            value={form.sobrenome}
            onChange={e => setForm(f => ({ ...f, sobrenome: e.target.value }))}
            placeholder="Silva"
            className={cn("mt-1", errors.sobrenome && "border-red-400 focus-visible:ring-red-400")}
            data-testid="input-sobrenome"
          />
          {errors.sobrenome && <p className="text-xs text-red-500 mt-1">{errors.sobrenome}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          E-mail <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="ana@email.com"
          className={cn("mt-1", errors.email && "border-red-400 focus-visible:ring-red-400")}
          data-testid="input-email"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="telefone" className="text-sm font-medium flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          Telefone <span className="text-red-500">*</span>
        </Label>
        <Input
          id="telefone"
          type="tel"
          value={form.telefone}
          onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
          placeholder="(48) 99999-0000"
          className={cn("mt-1", errors.telefone && "border-red-400 focus-visible:ring-red-400")}
          data-testid="input-telefone"
        />
        {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
      </div>

      <div>
        <Label htmlFor="cidade" className="text-sm font-medium flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Cidade
        </Label>
        <Input
          id="cidade"
          value={form.cidade}
          onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))}
          placeholder="Florianópolis"
          className="mt-1"
          data-testid="input-cidade"
        />
      </div>

      <div>
        <Label htmlFor="situacao" className="text-sm font-medium flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" />
          Situação atual
        </Label>
        <select
          id="situacao"
          value={form.situacao}
          onChange={e => setForm(f => ({ ...f, situacao: e.target.value }))}
          className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          data-testid="select-situacao"
        >
          <option value="">Selecione...</option>
          <option value="empregado_clt">Empregado CLT</option>
          <option value="empregado_pj">Empregado PJ</option>
          <option value="procurando">Procurando emprego</option>
          <option value="estudante">Estudante</option>
        </select>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Currículo (CV)</p>
        <div
          className="border-2 border-dashed border-border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
          onClick={() => cvRef.current?.click()}
        >
          <Upload className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            {form.cvFileName ? (
              <p className="text-sm font-medium text-foreground truncate">{form.cvFileName}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">Anexar currículo</p>
                <p className="text-xs text-muted-foreground">PDF, DOC ou DOCX</p>
              </>
            )}
          </div>
          {form.cvFileName && (
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 ml-auto" />
          )}
        </div>
        <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvChange} data-testid="input-cv" />
      </div>
    </div>
  );
}

function Step2({ form, setForm }: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Todos os campos são opcionais. Compartilhe seus links profissionais para destacar sua candidatura.</p>

      <div>
        <Label htmlFor="website" className="text-sm font-medium flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          Site pessoal / portfólio
        </Label>
        <Input
          id="website"
          value={form.website}
          onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
          placeholder="https://meusite.com.br"
          className="mt-1"
          data-testid="input-website"
        />
      </div>

      <div>
        <Label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-1.5">
          <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
          LinkedIn
        </Label>
        <Input
          id="linkedin"
          value={form.linkedin}
          onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
          placeholder="https://linkedin.com/in/seuperfil"
          className="mt-1"
          data-testid="input-linkedin"
        />
      </div>

      <div>
        <Label htmlFor="github" className="text-sm font-medium flex items-center gap-1.5">
          <Github className="w-3.5 h-3.5" />
          GitHub
        </Label>
        <Input
          id="github"
          value={form.github}
          onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
          placeholder="https://github.com/seuusuario"
          className="mt-1"
          data-testid="input-github"
        />
      </div>

      <div>
        <Label htmlFor="twitter" className="text-sm font-medium flex items-center gap-1.5">
          <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
          Twitter / X
        </Label>
        <Input
          id="twitter"
          value={form.twitter}
          onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))}
          placeholder="https://twitter.com/seuusuario"
          className="mt-1"
          data-testid="input-twitter"
        />
      </div>
    </div>
  );
}

function Step3({ form, setForm, questions }: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  questions: string[];
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Responda às perguntas abaixo para ajudar a empresa a conhecer melhor o seu perfil.</p>
      {questions.map((q, i) => (
        <div key={i}>
          <Label className="text-sm font-medium leading-normal">{i + 1}. {q}</Label>
          <Textarea
            value={form.answers[i] ?? ""}
            onChange={e => {
              const next = [...form.answers];
              next[i] = e.target.value;
              setForm(f => ({ ...f, answers: next }));
            }}
            placeholder="Sua resposta..."
            className="mt-2 min-h-[90px] resize-none"
            data-testid={`textarea-answer-${i}`}
          />
        </div>
      ))}
    </div>
  );
}

function Step4({ form, setForm, submitError }: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  submitError: string | null;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="motivacao" className="text-sm font-semibold">
          Por que você quer trabalhar aqui?
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">Conte o que te atrai nessa oportunidade, seus objetivos e como você pode contribuir.</p>
        <Textarea
          id="motivacao"
          value={form.motivacao}
          onChange={e => setForm(f => ({ ...f, motivacao: e.target.value }))}
          placeholder="Ex: Acompanho o trabalho da empresa há alguns anos e me identifico muito com a missão de... Acredito que minha experiência em... pode contribuir significativamente para..."
          className="min-h-[140px] resize-none"
          data-testid="textarea-motivacao"
        />
      </div>

      <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Termos e condições</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ao enviar sua candidatura, você autoriza a <strong>Orbi</strong> e a empresa anunciante a armazenar e processar seus dados pessoais para fins de recrutamento e seleção, em conformidade com a LGPD (Lei Geral de Proteção de Dados).
        </p>
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms"
            checked={form.acceptTerms}
            onCheckedChange={v => setForm(f => ({ ...f, acceptTerms: !!v }))}
            data-testid="checkbox-terms"
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-xs text-foreground leading-relaxed cursor-pointer">
            Li e aceito os termos de uso e a política de privacidade da Orbi. Autorizo o uso dos meus dados para esta candidatura.
          </Label>
        </div>
      </div>

      {submitError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {submitError}
        </p>
      )}
    </div>
  );
}

function SuccessScreen({ onClose, companyName }: { onClose: () => void; companyName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-9 h-9 text-green-500" />
      </div>
      <h3 className="text-xl font-black text-foreground mb-2">Candidatura enviada!</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-1">
        Sua candidatura foi registrada com sucesso.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
        A equipe de <strong>{companyName}</strong> irá analisar seu perfil e entrar em contato em breve. Boa sorte!
      </p>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
        onClick={onClose}
        data-testid="button-close-success"
      >
        Fechar
      </Button>
    </div>
  );
}

export default function ApplicationModal({ open, onClose, job }: ApplicationModalProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const questions = generateApplicationQuestions(job);

  const [form, setForm] = useState<FormState>({
    photo: null,
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    cidade: "",
    situacao: "",
    cvFileName: null,
    website: "",
    linkedin: "",
    github: "",
    twitter: "",
    answers: Array(questions.length).fill(""),
    motivacao: "",
    acceptTerms: false,
  });

  function validateStep1(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório.";
    if (!form.sobrenome.trim()) e.sobrenome = "Sobrenome é obrigatório.";
    if (!form.email.trim()) e.email = "E-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido.";
    if (!form.telefone.trim()) e.telefone = "Telefone é obrigatório.";
    return e;
  }

  function handleNext() {
    if (step === 0) {
      const e = validateStep1();
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
      setErrors({});
    }
    setStep(s => s + 1);
  }

  function handleSubmit() {
    if (!form.acceptTerms) {
      setSubmitError("Você precisa aceitar os termos para enviar a candidatura.");
      return;
    }
    setSubmitError(null);
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
      setErrors({});
      setSubmitError(null);
      setForm({
        photo: null,
        nome: "",
        sobrenome: "",
        email: "",
        telefone: "",
        cidade: "",
        situacao: "",
        cvFileName: null,
        website: "",
        linkedin: "",
        github: "",
        twitter: "",
        answers: Array(questions.length).fill(""),
        motivacao: "",
        acceptTerms: false,
      });
    }, 300);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100vw-2rem)] max-w-3xl",
            "bg-background rounded-2xl shadow-2xl border border-border",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2",
            "data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]",
            "overflow-hidden",
            submitted ? "max-h-[90vh]" : "max-h-[90vh]",
          )}
          data-testid="application-modal"
          aria-describedby="application-modal-description"
        >
          <DialogPrimitive.Title className="sr-only">
            Candidatar-se para {job.title}
          </DialogPrimitive.Title>
          <span id="application-modal-description" className="sr-only">
            Formulário de candidatura para {job.title} na {job.companyName}
          </span>

          {submitted ? (
            <SuccessScreen onClose={handleClose} companyName={job.companyName} />
          ) : (
            <div className="flex h-full max-h-[90vh]">
              {/* Left panel — job context (hidden on small screens) */}
              <div className="hidden md:flex flex-col w-64 flex-shrink-0 bg-foreground text-background p-6 rounded-l-2xl">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden mb-4">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-black text-white">{job.companyName[0]}</span>
                    )}
                  </div>
                  <h3 className="text-base font-black leading-tight mb-1">{job.title}</h3>
                  <p className="text-sm text-background/70 mb-4">{job.companyName}</p>

                  <div className="space-y-2 text-xs text-background/60">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{job.city}, {job.state}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 flex-shrink-0" />
                      <span>{CONTRACT_LABELS[job.contractType] ?? job.contractType} · {LEVEL_LABELS[job.level] ?? job.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 flex-shrink-0" />
                      <span>{MODALITY_LABELS[job.modality] ?? job.modality}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="text-xs text-background/40 space-y-1">
                    <p className="font-semibold text-background/60">Etapas do processo</p>
                    {STEP_LABELS.map((label, i) => (
                      <div key={i} className={cn(
                        "flex items-center gap-2 py-1",
                        i === step ? "text-background font-semibold" : "text-background/40"
                      )}>
                        <span className={cn(
                          "w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0",
                          i < step ? "bg-primary text-foreground" : i === step ? "bg-primary/20 border border-primary/40 text-background" : "bg-white/10"
                        )}>
                          {i < step ? "✓" : i + 1}
                        </span>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right panel — scrollable form */}
              <div className="flex flex-col flex-1 min-w-0 rounded-r-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border flex-shrink-0">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Etapa {step + 1} de {STEP_LABELS.length}
                    </p>
                    <h2 className="text-lg font-black text-foreground">{STEP_LABELS[step]}</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Fechar"
                    data-testid="button-close-modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Step indicator (mobile) */}
                <div className="px-6 pt-4 md:hidden flex-shrink-0">
                  <StepIndicator current={step} total={STEP_LABELS.length} />
                </div>

                {/* Step indicator (desktop, inside right panel) */}
                <div className="px-6 pt-4 hidden md:block flex-shrink-0">
                  <StepIndicator current={step} total={STEP_LABELS.length} />
                </div>

                {/* Form body */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                  {step === 0 && <Step1 form={form} setForm={setForm} errors={errors} />}
                  {step === 1 && <Step2 form={form} setForm={setForm} />}
                  {step === 2 && <Step3 form={form} setForm={setForm} questions={questions} />}
                  {step === 3 && <Step4 form={form} setForm={setForm} submitError={submitError} />}
                </div>

                {/* Footer navigation */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0 bg-background">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(s => s - 1)}
                    disabled={step === 0}
                    className="flex items-center gap-1"
                    data-testid="button-prev-step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar
                  </Button>

                  {step < STEP_LABELS.length - 1 ? (
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold flex items-center gap-1"
                      onClick={handleNext}
                      data-testid="button-next-step"
                    >
                      Avançar
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
                      onClick={handleSubmit}
                      data-testid="button-submit-application"
                    >
                      Enviar candidatura
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
