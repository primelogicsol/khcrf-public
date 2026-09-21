import Link from "next/link";

interface FeatureCardProps {
    title: string;
    description?: string;
    icon: React.ElementType;
    children?: React.ReactNode;
    link?: string;
}

export default function FeatureCard({ title, description, icon: Icon, children, link }: FeatureCardProps) {
    const CardContent = (
        <div className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden h-full ${link ? 'cursor-pointer' : ''}`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10">
                <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                    <Icon className="text-2xl text-icon-on-light group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
                {description && (
                    <p className="text-gray-600 leading-relaxed text-sm mb-4">
                        {description}
                    </p>
                )}
                {children}
            </div>
        </div>
    );

    if (link) {
        return (
            <Link href={link} className="block h-full">
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}
