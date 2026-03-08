export type DescriptionItem = {
    main:string;
    sub:string[];
}

export type Category = {
    title: string;
    description: DescriptionItem[];
};

    export type Data = Category[];

    const data: Data = [
        {
            title: "Finanças",
            description: [
                {main: "Nesse módulo você aprenderá:",
                sub: ["1. Como criar um orçamento pessoal",
                      "2. Como economizar dinheiro",
                      "3. Reserva de emergência"
                ]
                },
                
                

            ]
            
        },
        {
            title: "Marketing",
            description: [
                {main: "Nesse módulo você aprenderá:",
                sub: ["1. Definição de Persona",
                    "2. Funil de Vendas",
                    "3. Estratégias de Marketing Digital",
                    ]}
            ],
        },
        {
        title: "Networking",
        description: [
            {main: "Nesse módulo você aprenderá:",
            sub: [
                "1. Pitch de vendas pessoal",
                "2. Manutenção de contatos",
                "3. Eventos de networking"]}
        ]
        }
    ]

    export default data;
