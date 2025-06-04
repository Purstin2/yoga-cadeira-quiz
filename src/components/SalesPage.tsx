import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Shield,
  Clock,
  Gift,
  ArrowRight,
  Star,
  Zap,
  ChevronDown,
  Heart,
  Lock,
  TrendingDown,
  Award,
  HelpCircle,
  X,
  DollarSign,
  Users,
  Mail,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Header from './Header';
import AnimatedPage from './AnimatedPage';
import { useQuiz } from '../context/QuizContext';
import { trackEvent, PixelEvents } from '../utils/analytics';

const SalesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    goals,
    bodyType,
    ageRange,
    bodyMassIndex,
    setSelectedPlan,
  } = useQuiz();
  const mainElementRef = useRef<HTMLDivElement>(null);

  const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });
  const [expanded, setExpanded] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState(email || '');
  const [selectedPricing, setSelectedPricing] = useState('premium');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentViewers, setRecentViewers] = useState(173);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);
  const [remainingSpots, setRemainingSpots] = useState(23);
  const [reservedUsername, setReservedUsername] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showReservation, setShowReservation] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formFocused, setFormFocused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [processingPurchase, setProcessingPurchase] = useState(false);
  const faqs = [
    {
      question: 'Quanto tempo vou precisar dedicar por dia?',
      answer:
        'O método foi desenvolvido para pessoas ocupadas, com sessões de 10-15 minutos que se encaixam em qualquer rotina. Você pode praticar no trabalho, assistindo TV ou até em reuniões online.',
    },
    {
      question: 'Preciso ter experiência prévia com yoga?',
      answer:
        'Não, o método é especialmente projetado para iniciantes. Começamos com movimentos simples e progredimos gradualmente conforme sua evolução.',
    },
    {
      question: 'Este programa é seguro para minha condição física?',
      answer:
        'Sim! O método foi criado por especialistas em fisioterapia e educação física, com versões para diferentes tipos corporais. Os exercícios são de baixo impacto e altamente seguros.',
    },
    {
      question: 'Em quanto tempo verei resultados?',
      answer:
        'A maioria dos usuários percebe melhoras na mobilidade e bem-estar já na primeira semana. Para resultados mais significativos como perda de peso, ganho de força ou redução da ansiedade, o protocolo completo de 21 dias oferece transformações notáveis e sustentáveis.',
    },
    {
      question: 'Como recebo o material após a compra? ',
      answer:
        'Imediatamente após a compra, você recebe um email com o link para baixar o material. Todo o conteúdo estará disponível em formato PDF de alta qualidade, otimizado para visualização em qualquer dispositivo.',
    },
  ];

  // External checkout URL - single point to update
  const EXTERNAL_CHECKOUT_URL =
    'https://pagamento.fenjes.com/checkout/184693584:1';

  // Monitorar progresso de rolagem
  useEffect(() => {
    const handleScroll = () => {
      if (!mainElementRef.current) return;

      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / scrollHeight;

      setScrollProgress(progress);

      // Mostrar CTA fixo após 50% da rolagem (modificado de 800px para 50%)
      if (progress > 0.5) {
        setStickyCtaVisible(true);
      } else {
        setStickyCtaVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { minutes: prevTime.minutes - 1, seconds: 59 };
        } else {
          clearInterval(interval);
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulação de outros usuários
  useEffect(() => {
    const viewersInterval = setInterval(() => {
      setRecentViewers((prev) => {
        const change = Math.random() > 0.7 ? 1 : 0;
        return prev + change;
      });

      // Aleatoriamente mostrar notificação de reserva
      if (Math.random() > 0.85 && remainingSpots > 10) {
        const randomNames = [
          'Maria',
          'João',
          'Ana',
          'Carlos',
          'Juliana',
          'Roberto',
          'Fernanda',
          'Rafael',
        ];
        setReservedUsername(
          randomNames[Math.floor(Math.random() * randomNames.length)]
        );
        setRemainingSpots((prev) => prev - 1);
        setShowReservation(true);

        setTimeout(() => {
          setShowReservation(false);
        }, 4000);
      }
    }, 8000);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(viewersInterval);
      clearInterval(testimonialInterval);
    };
  }, [remainingSpots]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailValid) {
      // Rastrear evento de Lead
      trackEvent(PixelEvents.LEAD, {
        content_name: 'sales_page_form',
        content_category: 'lead_capture',
      });

      // Efeito de confete
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Som de sucesso
      try {
        audioRef.current = new Audio('/success.mp3');
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {
          // Silenciosamente falha se autoplay bloqueado
        });
      } catch (e) {
        console.log('Audio failed to play');
      }

      setEmail(userEmail);
      setSelectedPlan(
        selectedPricing as 'starter' | 'complete' | 'premium' | null
      );
      setProcessingPurchase(true);

      // Rastrear evento de Iniciar Checkout
      trackEvent(PixelEvents.INITIATE_CHECKOUT, {
        currency: 'BRL',
        value: 197.0,
        content_name: 'Yoga na Cadeira Premium',
      });

      // Redirect to external checkout com UTMs preservados
      setTimeout(() => {
        const urlWithUtms = preserveUtmParams(EXTERNAL_CHECKOUT_URL);
        window.location.href = urlWithUtms;
      }, 1500);
    }
  };

  // Redirect to external checkout
  const redirectToCheckout = () => {
    // Rastrear evento de Iniciar Checkout
    trackEvent(PixelEvents.INITIATE_CHECKOUT, {
      currency: 'BRL',
      value: 197.0,
      content_name: 'Yoga na Cadeira Premium',
    });

    window.location.href = EXTERNAL_CHECKOUT_URL;
  };

  // Componente para exibir o timer em formato MM:SS
  const Timer = ({
    minutes,
    seconds,
  }: {
    minutes: number;
    seconds: number;
  }) => (
    <div className="font-mono text-xl md:text-2xl font-bold">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );

  // Gerar testemunhos relevantes baseados no perfil
  const testimonials = [
    {
      quote:
        'Perdi 7kg em 21 dias sem sair da cadeira. Nunca pensei que seria possível com minha idade!',
      author: 'Maria S., 58 anos',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      relevance: ['lose-weight', 'senior'],
    },
    {
      quote:
        'Minhas dores nas costas desapareceram completamente. Minha médica ficou impressionada com minha mobilidade.',
      author: 'Carlos L., 62 anos',
      image: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg',
      relevance: ['improve-mobility', 'senior'],
    },
    {
      quote:
        'Como mãe de 3 filhos, nunca tinha tempo para exercícios. Este método me permitiu praticar durante o trabalho!',
      author: 'Patrícia M., 43 anos',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      relevance: ['manage-mood', 'lose-weight'],
    },
    {
      quote:
        'Minha ansiedade diminuiu drasticamente e minha energia aumentou. Tudo com apenas 15 minutos por dia!',
      author: 'Roberto F., 48 anos',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      relevance: ['manage-mood'],
    },
  ];

  // Value stack itens
  const valueStackItems = [
    { name: 'Método Yoga na Cadeira Premium', value: 'R$197', included: true },
    { name: 'Plano 21 Dias de Transformação', value: 'R$67', included: true },
    {
      name: 'Suporte na Comunidade VIP (3 meses)',
      value: 'R$147',
      included: true,
    },
    { name: 'Guia Nutricional Simplificado', value: 'R$37', included: true },
    { name: 'Acompanhamento de Progresso', value: 'R$97', included: true },
    {
      name: 'Bônus: Meditações Guiadas',
      value: 'R$57',
      included: true,
      highlight: true,
    },
    {
      name: 'Bônus: Mini-curso de Respiração',
      value: 'R$47',
      included: true,
      highlight: true,
    },
  ];

  // Determinar benefício principal baseado no perfil
  const getMainBenefit = () => {
    const selectedGoalIds = goals.filter((g) => g.selected).map((g) => g.id);

    if (selectedGoalIds.includes('lose-weight')) {
      return 'Emagreça naturalmente sem precisar sair da cadeira';
    }
    if (selectedGoalIds.includes('improve-mobility')) {
      return 'Recupere sua mobilidade e elimine as dores';
    }
    if (selectedGoalIds.includes('manage-mood')) {
      return 'Reduza o estresse e ansiedade sem sair da cadeira';
    }

    return 'Transforme seu corpo e saúde sem sair da cadeira';
  };

  // Gerar o preço baseado no stack de valor
  const getTotalValue = () => {
    return valueStackItems.reduce((total, item) => {
      if (item.included) {
        // Extrair valor numérico do preço
        const value = parseFloat(
          item.value.replace(/[^0-9,]/g, '').replace(',', '.')
        );
        return total + value;
      }
      return total;
    }, 0);
  };

  // Scrollar para o formulário de compra
  const scrollToForm = () => {
    document.getElementById('buy-form')?.scrollIntoView({ behavior: 'smooth' });

    // Rastrear evento de interesse
    trackEvent('FormView', {
      content_name: 'sales_page_form_view',
    });

    // Focar o input de email
    setTimeout(() => {
      setFormFocused(true);
      document.getElementById('email-input')?.focus();
    }, 500);
  };

  // Adicionar rastreamento de visualização de página quando o componente montar
  useEffect(() => {
    // Rastrear visualização da página de vendas
    trackEvent('SalesPageDetailedView', {
      content_name: 'sales_page',
      content_category: 'sales',
    });
  }, []);

  return (
    <AnimatedPage>
      <div
        ref={mainElementRef}
        className="min-h-screen flex flex-col bg-gradient-to-b from-[#F7F3FF] to-white"
      >
        <Header />

        {/* Hero Section Otimizada */}
        <section className="px-5 py-10 md:py-16 bg-gradient-to-br from-[#7432B4] to-[#9747FF] text-white relative overflow-hidden">
          {/* Background removed as requested */}

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center bg-white/10 text-yellow-300 backdrop-blur-sm rounded-xl py-2 px-4 mb-5 whitespace-nowrap overflow-hidden"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Shield className="w-5 h-5 mr-2" />
              </motion.div>
              <span className="font-bold mr-1">OFERTA ESPECIAL</span> • Apenas{' '}
              <span className="font-bold inline-block">{remainingSpots}</span>{' '}
              vagas disponíveis
            </motion.div>

            <motion.h1
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getMainBenefit()}
            </motion.h1>

            <motion.div
              className="text-lg md:text-xl mb-6 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="mb-2">
                <span className="font-semibold">
                  Método Exclusivo de Yoga na Cadeira com Resultados Garantidos
                  em 21 Dias
                </span>
              </p>
              <p className="text-base text-white/90">
                Desenvolvimento e aprovado por fisioterapeutas • Mais de{' '}
                <span className="text-yellow-300 font-bold">9.879</span> vidas
                transformadas
              </p>
            </motion.div>

            {/* Contador em destaque */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 mb-6 max-w-lg mx-auto"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-left">
                  <span className="text-white/80 text-sm">Preço Normal</span>
                  <div className="text-xl line-through text-white/70">
                    R$197,00
                  </div>
                </div>
                <div className="h-10 border-l border-white/20"></div>
                <div className="text-right">
                  <span className="text-white/80 text-sm">Hoje Apenas</span>
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300">
                    R$19,90
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 mb-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-white/80 text-sm">Oferta expira em:</div>
                  <div className="flex items-center gap-1">
                    <div className="bg-white/20 w-10 h-10 rounded-md flex items-center justify-center font-mono text-xl font-bold">
                      {String(timeLeft.minutes).padStart(2, '0').charAt(0)}
                    </div>
                    <div className="bg-white/20 w-10 h-10 rounded-md flex items-center justify-center font-mono text-xl font-bold">
                      {String(timeLeft.minutes).padStart(2, '0').charAt(1)}
                    </div>
                    <span className="text-xl">:</span>
                    <div className="bg-white/20 w-10 h-10 rounded-md flex items-center justify-center font-mono text-xl font-bold">
                      {String(timeLeft.seconds).padStart(2, '0').charAt(0)}
                    </div>
                    <div className="bg-white/20 w-10 h-10 rounded-md flex items-center justify-center font-mono text-xl font-bold">
                      {String(timeLeft.seconds).padStart(2, '0').charAt(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-1 text-xs mb-2">
                <div className="bg-white/10 rounded-lg px-2 py-2 flex-1 flex items-center gap-1 text-center justify-center">
                  <span>Garantia</span>
                  <span className="text-yellow-300 font-bold truncate">
                    7 DIAS
                  </span>
                </div>
                <div className="bg-white/10 rounded-lg px-2 py-2 flex-1 flex items-center gap-1 text-center justify-center">
                  <span>Pagamento</span>
                  <span className="text-yellow-300 font-bold truncate">
                    ÚNICO
                  </span>
                </div>
                <div className="bg-white/10 rounded-lg px-2 py-2 flex-1 flex items-center gap-1 text-center justify-center">
                  <span>Acesso</span>
                  <span className="text-yellow-300 font-bold truncate">
                    VITALÍCIO
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.button
                onClick={redirectToCheckout}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2D1441] font-bold text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-1 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  y: [0, -3, 0],
                  boxShadow: [
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                {/* Efeito de brilho */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%', opacity: 0.3 }}
                  animate={{ x: '100%', opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />

                <span className="relative z-10">
                  QUERO TRANSFORMAR MINHA VIDA AGORA
                </span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 relative z-10 ml-1" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Prova Social Ampliada - Layout com animação de slide */}
        <section className="bg-white py-4 md:py-6 border-b border-gray-100 overflow-hidden">
          <div className="max-w-4xl mx-auto px-5 relative">
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, -1000, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="flex items-center mx-8 whitespace-nowrap">
                <Shield className="w-4 h-4 text-[#7432B4] mr-1.5" />
                <span className="text-sm text-gray-700">
                  Método certificado
                </span>
              </div>
              <div className="flex items-center mx-8 whitespace-nowrap">
                <div className="flex text-yellow-400 mr-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3 h-3 md:w-4 md:h-4 fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-700">
                  4.9/5 (873 avaliações)
                </span>
              </div>
              <div className="flex items-center mx-8 whitespace-nowrap">
                <Heart className="w-4 h-4 text-[#7432B4] mr-1.5" />
                <span className="text-sm text-gray-700">
                  9.879 pessoas transformadas
                </span>
              </div>
              <div className="flex items-center mx-8 whitespace-nowrap">
                <Users className="w-4 h-4 text-[#7432B4] mr-1.5" />
                <motion.span
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                  className="text-sm text-gray-700"
                >
                  <span className="font-bold">{recentViewers}</span> pessoas
                  online agora
                </motion.span>
              </div>
              {/* Duplicates for seamless looping */}
              <div className="flex items-center mx-8 whitespace-nowrap">
                <Shield className="w-4 h-4 text-[#7432B4] mr-1.5" />
                <span className="text-sm text-gray-700">
                  Método certificado
                </span>
              </div>
              <div className="flex items-center mx-8 whitespace-nowrap">
                <div className="flex text-yellow-400 mr-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3 h-3 md:w-4 md:h-4 fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-700">
                  4.9/5 (873 avaliações)
                </span>
              </div>
              <div className="flex items-center mx-8 whitespace-nowrap">
                <Heart className="w-4 h-4 text-[#7432B4] mr-1.5" />
                <span className="text-sm text-gray-700">
                  9.879 pessoas transformadas
                </span>
              </div>
              <div className="flex items-center mx-8 whitespace-nowrap">
                <Users className="w-4 h-4 text-[#7432B4] mr-1.5" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold">{recentViewers}</span> pessoas
                  online agora
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problema e Solução - Nova Seção */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D1441] mb-4">
                Por Que A Maioria das Pessoas Não Consegue Manter Uma Rotina de
                Exercícios?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-red-50 rounded-xl p-6 border border-red-100"
              >
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  <X className="w-5 h-5" /> O Problema:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <X className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Falta de tempo:</span> A
                      vida moderna é corrida e encontrar 1-2 horas para a
                      academia é quase impossível
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <X className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Deslocamento:</span> O tempo
                      gasto indo e voltando da academia acaba desmotivando
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <X className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Constrangimento:</span>{' '}
                      Muitos se sentem intimidados em ambientes de academia
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <X className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Baixa acessibilidade:</span>{' '}
                      Exercícios tradicionais não são adaptados para diferentes
                      corpos e limitações
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <X className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Inconsistência:</span> Sem
                      um plano estruturado, a maioria desiste nas primeiras
                      semanas
                    </span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-green-50 rounded-xl p-6 border border-green-100"
              >
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" /> A Solução:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Mínimo tempo efetivo:</span>{' '}
                      Apenas 15 minutos diários para resultados transformadores
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Zero deslocamento:</span>{' '}
                      Pratique em qualquer lugar onde haja uma cadeira - casa,
                      escritório ou viagens
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Privacidade total:</span>{' '}
                      Exercite-se no conforto e privacidade de seu ambiente, sem
                      julgamentos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        Personalização completa:
                      </span>{' '}
                      Adaptado para seu corpo, limitações e objetivos
                      específicos
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium">Plano estruturado:</span>{' '}
                      Progressão planejada de 21 dias com acompanhamento para
                      garantir resultados
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* O Que Você Recebe - Redesenhado */}
        <section className="py-12 md:py-16 bg-[#F8F5FF]">
          <div className="max-w-4xl mx-auto px-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D1441] mb-4">
                O Que Você Vai Receber Hoje
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Acesso imediato a todo o método completo e bônus exclusivos
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-purple-100 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-[#7432B4]/10 p-3 rounded-full flex-shrink-0">
                    <Check className="w-6 h-6 md:w-7 md:h-7 text-[#7432B4]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-[#2D1441] mb-1">
                      Método Completo de Yoga na Cadeira (Valor: R$97)
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Guia detalhado com 45+ exercícios ilustrados, passo a
                      passo, e progressão para iniciantes até avançados. Uma
                      abordagem completa que transforma seu corpo e mente sem
                      precisar sair da cadeira.
                    </p>

                    {/* Antes e Depois - Ajustado para ficar dentro das margens */}
                    <div className="mt-3 bg-purple-50 rounded-lg p-3 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-[#7432B4] font-medium text-sm">
                          Resultados Típicos:
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-bold text-sm">
                              -7kg
                            </span>
                          </div>
                          <span className="text-gray-400 hidden sm:inline">
                            |
                          </span>
                          <div className="flex items-center gap-0.5">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-red-500 font-bold text-sm">
                              +69% energia
                            </span>
                          </div>
                          <span className="text-gray-400 hidden sm:inline">
                            |
                          </span>
                          <div className="flex items-center gap-0.5">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-500 font-bold text-sm">
                              -82% dores
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-[#7432B4]/10 p-3 rounded-full flex-shrink-0">
                    <Check className="w-6 h-6 md:w-7 md:h-7 text-[#7432B4]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-[#2D1441] mb-1">
                      Plano de 21 Dias de Transformação (Valor: R$67)
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Roteiro diário com exercícios progressivos que se adaptam
                      ao seu ritmo, calendário de acompanhamento e diário de
                      registro para resultados visíveis em apenas 3 semanas.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-[#7432B4]/10 p-3 rounded-full flex-shrink-0">
                    <Check className="w-6 h-6 md:w-7 md:h-7 text-[#7432B4]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-[#2D1441] mb-1">
                      Guia de Respiração e Meditação na Cadeira (Valor: R$47)
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Técnicas exclusivas para combater estresse, ansiedade e
                      melhorar o foco, com rotinas rápidas de 3-5 minutos que
                      podem ser feitas em qualquer lugar.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0">
                    <Gift className="w-6 h-6 md:w-7 md:h-7 text-yellow-600" />
                  </div>
                  <div className="relative">
                    <motion.div
                      className="absolute -right-2 -top-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-md shadow-sm"
                      animate={{
                        rotate: [0, -3, 3, -3, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      BÔNUS EXCLUSIVO
                    </motion.div>

                    <h3 className="font-bold text-lg md:text-xl text-[#2D1441] mb-1">
                      Mini-Guia de Nutrição Simplificada (Valor: R$37)
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Dicas de alimentação descomplicada que potencializam os
                      resultados dos exercícios, com opções práticas para
                      diferentes objetivos e rotinas.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 bg-gradient-to-r from-[#F7F3FF] to-[#F0E6FF] rounded-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 font-medium">
                    Valor Total:
                  </span>
                  <span className="text-lg font-bold line-through text-gray-500">
                    R$248,00
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-[#2D1441] mr-3">
                      Oferta Especial ABFS:
                    </span>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                    >
                      ECONOMIA DE 92%
                    </motion.div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-green-600">
                      R$19,90
                    </div>
                    <div className="text-xs text-gray-500">
                      Pagamento único • Acesso vitalício
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-600 mb-5">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-[#7432B4]" />
                    <span>Garantia de 7 dias</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[#7432B4]" />
                    <span>Acesso imediato</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#7432B4]" />
                    <span>Apenas {remainingSpots} vagas restantes</span>
                  </div>
                </div>

                {/* Botão adicional na seção dos benefícios */}
                {processingPurchase ? (
                  <div className="text-center py-6">
                    <motion.div
                      className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <p className="font-medium">Processando sua compra...</p>
                  </div>
                ) : (
                  <motion.button
                    onClick={redirectToCheckout}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2D1441] font-bold text-lg py-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    COMPRAR AGORA COM DESCONTO
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testemunhos com Antes e Depois - Nova Seção */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D1441] mb-4">
                Depoimentos de Pessoas Reais
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Veja como nosso método transformou a vida de pessoas como você
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-100"
                >
                  <div className="flex text-yellow-400 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2D1441]">
                        {testimonial.author}
                      </p>
                      <div className="text-xs text-purple-600 font-medium mt-0.5">
                        Cliente Verificado ✓
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Estatísticas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-[#F7F3FF] rounded-xl p-6 grid grid-cols-3 gap-4"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#7432B4] mb-1">
                  97%
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  Taxa de satisfação
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#7432B4] mb-1">
                  21 dias
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  Resultados visíveis
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#7432B4] mb-1">
                  9.879+
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  Vidas transformadas
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ - Redesenhado */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-5">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D1441] mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-gray-600">
                Tudo o que você precisa saber antes de começar
              </p>
            </motion.div>

            <div className="space-y-4 mb-10">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <button
                    className="w-full flex justify-between items-center p-4 md:p-5 text-left"
                    onClick={() =>
                      setExpanded(expanded === index ? null : index)
                    }
                  >
                    <span className="text-sm md:text-base font-medium text-[#2D1441]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 md:w-5 md:h-5 text-[#7432B4] transition-transform ${
                        expanded === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expanded === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-4 md:px-5 pb-4 md:pb-5 pt-2 border-t border-gray-100"
                    >
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulário de Compra */}
        <section
          id="buy-now"
          className="py-12 md:py-16 bg-gradient-to-br from-[#7432B4] to-[#9747FF] text-white scroll-mt-20"
        >
          <div className="max-w-4xl mx-auto px-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Transforme Seu Corpo e Saúde Hoje
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Método completo de Yoga na Cadeira por apenas{' '}
                <span className="font-bold text-yellow-300">R$19,90</span> -
                Acesso vitalício
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 max-w-md mx-auto mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  ÚLTIMA CHANCE: ACESSO AO MÉTODO COMPLETO
                </h3>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-left">
                    <span className="text-white/80 text-sm">Preço Normal</span>
                    <div className="text-xl line-through text-white/70">
                      R$197,00
                    </div>
                  </div>
                  <div className="h-10 border-l border-white/20"></div>
                  <div className="text-right">
                    <span className="text-white/80 text-sm">Hoje Apenas</span>
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300">
                      R$19,90
                    </div>
                  </div>
                </div>

                {processingPurchase ? (
                  <div className="text-center py-6">
                    <motion.div
                      className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <p className="font-medium">Processando sua compra...</p>
                  </div>
                ) : (
                  <motion.button
                    onClick={redirectToCheckout}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2D1441] font-bold text-lg py-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    COMPRAR AGORA COM DESCONTO
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </motion.button>
                )}

                <div className="pt-4 border-t border-white/20 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/80 text-sm">
                      Oferta expira em:
                    </span>
                    <Timer
                      minutes={timeLeft.minutes}
                      seconds={timeLeft.seconds}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/80">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>Pagamento 100% seguro</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Restam apenas {remainingSpots} vagas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Garantia movida para cima para não ser cortada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 max-w-md mx-auto mb-4"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
                  <h3 className="font-bold text-white text-lg md:text-xl">
                    Garantia Incondicional de 7 Dias
                  </h3>
                </div>
                <p className="text-sm md:text-base text-white/90 mb-4">
                  Experimente o método completo por 7 dias. Se por qualquer
                  motivo não estiver 100% satisfeito, basta enviar um email e
                  devolveremos integralmente seu investimento, sem perguntas.
                </p>
                <div className="text-xs text-white/80 text-center">
                  Sua compra está protegida pela política de reembolso do
                  Hotmart
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Notificação de reserva */}
        <AnimatePresence>
          {showReservation && (
            <motion.div
              initial={{ opacity: 0, x: -100, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 20 }}
              exit={{ opacity: 0, x: -100, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-[250px] z-50"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">
                    <span className="font-bold">{reservedUsername}</span> acabou
                    de reservar uma vaga
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    agora restam apenas {remainingSpots} vagas
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confete na compra */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* Confete é gerenciado pelo código */}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default SalesPage;
