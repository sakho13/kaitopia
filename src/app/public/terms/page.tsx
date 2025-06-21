import { InfoArea } from "@/components/atoms/InfoArea"
import { TermsOfService } from "@/components/atoms/TermsOfService"

export default function Page() {
  return (
    <div className='w-full max-w-3xl mx-auto p-4'>
      <InfoArea colorMode='white' className='select-none text-text'>
        <TermsOfService />
      </InfoArea>
    </div>
  )
}
