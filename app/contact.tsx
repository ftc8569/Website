import {useCallback, useState} from "react";
import {useReCaptcha} from "next-recaptcha-v3";

export default function ContactUs() {
  const [validEmail, setValidEmail] = useState(true);
  const [validEntry, setValidEntry] = useState(true);

  const { executeRecaptcha } = useReCaptcha();

  const send = useCallback(async (data: FormData) => {
    let retry = false;
    const entry = data.get("entry")
    if(!entry) { setValidEntry(false); retry = true; }
    const email = data.get("email")
    if(!email) { setValidEmail(false); retry = true; }
    if(retry) return;

    const token = await executeRecaptcha("form_submit");

    // TODO: reset form after submission or alert of errors
    await fetch("/api/contact-us", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        entry: entry,
        name: data.get("name"),
        subject: data.get("subject"),
        token: token
      })
    })

  }, [executeRecaptcha, validEmail, validEntry]);

  return (
    <div className="py-10 bg-[#151515]">
      <div className="mx-44">
        <div className="flex items-center justify-center pb-5">
          <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">Contact Us</h1>
        </div>
        <div className="flex flex-row">
          <textarea
            form="contact-form"
            className={"w-2/3 h-36 mx-5 p-1 bg-[#363636] rounded border-2 " + (validEntry ? "border-roboPink" : "border-red-500")}
            placeholder="I was wondering how you guys did..."
            name="entry"
          />
          <form id="contact-form" className="w-1/3 px-5" action={send}>
            <div className="w-full flex flex-col justify-between h-full">
              <input name="email" type="email" placeholder="Enter your email"
                     className={"bg-[#363636] text-xl w-full mb-2 p-1 rounded-sm border-2 " + (validEmail ? "border-roboPink" : "border-red-500")}/>
              <input name="name" type="text" placeholder="Enter your name"
                     className="bg-[#363636] text-xl mb-2 p-1 rounded-sm border-roboPink border-2 w-full"/>
              <div className="flex flex-row">
                <input name="subject" type="text" placeholder="Enter your subject"
                       className="bg-[#363636] text-xl w-full p-1 rounded-sm border-roboPink border-2"/>
                <button type="submit" className="g-recaptcha bg-roboHotPink px-4 ml-2 rounded-sm text-lg">Send</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}