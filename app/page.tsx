import { InquiryApp } from "@/components/InquiryApp";
import { LocaleProvider } from "@/components/LocaleProvider";

export default function Home() {
  return (
    <main className="min-h-full">
      <LocaleProvider>
        <InquiryApp />
      </LocaleProvider>
    </main>
  );
}
