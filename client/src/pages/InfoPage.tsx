import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, HelpCircle, Ruler, FileText } from 'lucide-react';

const InfoPage = () => {
  const { slug } = useParams();
  
  const getPageContent = () => {
    switch (slug) {
      case 'shipping':
        return {
          title: 'GLOBAL ACCESS',
          subtitle: 'SHIPPING & LOGISTICS',
          icon: Truck,
          content: [
            { h: 'The Aura Standard', p: 'Every acquisition from Aura L\'Élite is handled with the utmost care. We utilize specialized luxury logistics partners to ensure your pieces arrive in pristine condition, anywhere in the world.' },
            { h: 'Global Delivery Timeframes', p: 'Standard: 3-5 business days. Express: 1-2 business days. Bespoke: Varies by piece.' },
            { h: 'Complimentary Access', p: 'Orders exceeding ₹1,000 qualify for complimentary global express shipping.' }
          ]
        };
      case 'faq':
        return {
          title: 'THE DIALOGUE',
          subtitle: 'FREQUENTLY ASKED QUESTIONS',
          icon: HelpCircle,
          content: [
            { h: 'How do I authenticate my piece?', p: 'Each Aura piece contains a discrete NFC chip. Simply tap your smartphone to the interior label to access the digital certificate of authenticity.' },
            { h: 'Can I request a private viewing?', p: 'Yes. Our elite members can request private viewing sessions at any of our global ateliers in Paris, London, or New York.' },
            { h: 'What is the "Aura Vault"?', p: 'The Vault is our private archive. Pieces that enter the vault are no longer available for general acquisition and can only be accessed by Elite Tier members.' }
          ]
        };
      case 'size-guide':
        return {
          title: 'PRECISION FIT',
          subtitle: 'SIZE & MEASUREMENT GUIDE',
          icon: Ruler,
          content: [
            { h: 'Our Silhouettes', p: 'Aura pieces are designed with architectural structure. We offer three distinct fits: Sculpted (Slim), Fluid (Regular), and Monolith (Oversized).' },
            { h: 'Measurement Service', p: 'If you are unsure of your fit, our concierge team is available for virtual measurement consultations.' },
            { h: 'Alterations', p: 'Complimentary alterations are available at any of our physical ateliers for up to 6 months after acquisition.' }
          ]
        };
      case 'privacy':
        return {
          title: 'CRYPTO PRIVACY',
          subtitle: 'DATA & SECURITY PROTOCOLS',
          icon: ShieldCheck,
          content: [
            { h: 'Your Digital Identity', p: 'We utilize advanced cryptographic protocols to ensure your transaction history and personal data remain strictly confidential.' },
            { h: 'Third-Party Disclosure', p: 'Aura L\'Élite never shares client data with third-party marketing entities. Your privacy is our highest priority.' },
            { h: 'Right to Dissolve', p: 'At any time, you may request the complete dissolution of your digital record from our ecosystem.' }
          ]
        };
      default:
        return {
          title: 'INFORMATION',
          subtitle: 'GENERAL DISCLOSURE',
          icon: FileText,
          content: [{ h: 'Aura L\'Élite', p: 'Defining the intersection of architecture and apparel.' }]
        };
    }
  };

  const page = getPageContent();

  return (
    <main className="bg-luxury-black min-h-screen text-primary pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-24">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-secondary mb-12">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-primary">{page.subtitle}</span>
          </nav>
          
          <div className="flex items-center gap-6 mb-8">
             <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                <page.icon size={24} strokeWidth={1.5} />
             </div>
             <motion.span 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-luxury-gold text-[10px] uppercase tracking-[0.5em] font-black"
             >
               Legal & Information
             </motion.span>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif italic mb-4 tracking-tight"
          >
            {page.title}
          </motion.h1>
          <p className="text-secondary text-sm md:text-md tracking-[0.3em] uppercase italic">{page.subtitle}</p>
        </header>

        <div className="space-y-24">
          {page.content.map((item, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <h2 className="text-xs uppercase tracking-[0.4em] font-black mb-8 border-b border-primary/5 pb-4 group-hover:border-luxury-gold/30 transition-colors">
                {item.h}
              </h2>
              <p className="text-secondary text-sm md:text-lg tracking-widest leading-loose italic">
                {item.p}
              </p>
            </motion.section>
          ))}
        </div>

        <footer className="mt-32 pt-12 border-t border-primary/5 flex justify-center">
          <Link to="/contact" className="text-[10px] uppercase tracking-[0.4em] font-black hover:text-luxury-gold transition-colors flex items-center gap-4">
             Still have questions? Contact Concierge <ChevronRight size={14} />
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default InfoPage;
