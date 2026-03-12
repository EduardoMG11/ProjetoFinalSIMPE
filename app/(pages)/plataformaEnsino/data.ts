import video1 from "./videos/financeiro.mp4";
import video2 from "./videos/marketing.mp4";
import video3 from "./videos/networking.mp4";

export type DescriptionItem = {
  main: string;
  sub: string[];
};

export type Category = {
  title: string;
  description: DescriptionItem[];
  videofi?: any;
};

export type Data = Category[];

const data: Data = [
  {
    title: "Finanças",
    videofi: video1,
    description: [
      {
        main: "Nesse módulo você aprenderá:",
        sub: [
          "1. Receitas",
          "2. Despesas",
          "3. Entendimento de planejamento financeiro",
        ],
      },
    ],
  },
  {
    title: "Marketing",
    videofi: video2,
    description: [
      {
        main: "Nesse módulo você aprenderá:",
        sub: [
          "1. Público-alvo",
          "2. Diferencial competitivo",
          "3. Comunicação",
        ],
      },
    ],
  },
  {
    title: "Networking",
    videofi: video3,
    description: [
      {
        main: "Nesse módulo você aprenderá:",
        sub: [
          "1. Troca de valores",
          "2.  O que é Networking e formação de redes de contato",
        ],
      },
    ],
  },
];

export default data;
