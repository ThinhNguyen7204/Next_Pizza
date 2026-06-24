import CartPopUpModal from "@/components/modals/cart-pop-up-modal";
import Footer from "@/components/widgets/footer";
import Header from "@/components/widgets/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-cream text-charcoal selection:bg-primary/30">
      <Header />
      <CartPopUpModal />

      <main className='grow'>{children}</main>
      <Footer />
    </div>
  )
}