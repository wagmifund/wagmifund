import MetaTags from "@components/MetaTags";
import { Footer } from "@modules/LandingPage/Footer";
import { APP_NAME } from "@utils/constants";
import type { FC } from "react";

const Privacy: FC = () => {
  return (
    <>
      <MetaTags title={`Privacy • Wagmi Fund`} />
      <div className="flex justify-center items-center w-full h-48 bg-theme">
        <div className="relative text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Privacy Policy
          </h1>
          <div className="flex justify-center mt-4">
            <div className="py-0.5 px-2 text-xs text-white bg-gray-800 rounded-md">
              Updated December 25, 2022
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg sm:w-2/4 max-w-3/4">
            <div className="!p-8 max-w-none text-white">
              <p>
                {APP_NAME}.xyz. (&ldquo;{APP_NAME}&rdquo; or &ldquo;we&rdquo;)
                respects and protects the privacy of Users (&ldquo;you&rdquo; or
                &ldquo;users&rdquo;). {APP_NAME} will collect and use your
                Personal Information, generated from your use of {APP_NAME}, in
                accordance with this Privacy Policy (&ldquo;Policy&rdquo;).
              </p>
              <div className="mt-8 mb-5 text-xl font-bold text-white">
                What information do we collect
              </div>
              <p className="mb-5">
                We get information about you in a range of ways.
              </p>
              <p className="mb-5">
                Information you give us. Information we collect from you
                includes:
              </p>
              <ul className="mb-3 space-y-2 list-disc list-inside">
                <li>Network information regarding transactions;</li>
                <li>Contact information, like username and email;</li>
                <li>
                  Feedback and correspondence, such as information you provide
                  in your responses to surveys, when you participate in market
                  research activities, report a problem with Service, receive
                  customer support or otherwise correspond with us;
                </li>
                <li className="linkify">
                  Usage information, such as information about how you interact
                  with us, and it is anonymous;
                </li>
              </ul>
              <div className="mt-8 mb-5 text-xl font-bold text-white dark:text-white">
                How we use the information we collect
              </div>
              <p className="mb-5">
                Our primary purpose in collecting information is to to help us
                operate, provide, improve, customize, support, and market our
                Services.
              </p>
              <ul className="mb-3 space-y-2 list-disc list-inside">
                <li>Provide the Services and customer support you request;</li>
                <li>Resolve disputes and troubleshoot problems;</li>
              </ul>
              <div className="mt-8 mb-5 text-xl font-bold text-white dark:text-white">
                How we update our policy
              </div>
              <p className="mb-5">
                We reserves the right to update this Policy online from time to
                time, and the new policy will immediately replace the older one
                once posted.
              </p>
              <p className="mb-5">
                We will notify you of material changes to this policy by
                updating the last updated date at the top of this page.
              </p>
              <p className="mb-5">
                In particular, if you do not accept the revised policies, please
                immediately stop your use of {APP_NAME}.
              </p>
              <p className="mb-5">
                Your continued use of our Services confirms your acceptance of
                our Privacy Policy, as amended. If you do not agree to our
                Privacy Policy, as amended, you must stop using our Services. We
                recommend that you visit this page frequently to check for
                changes.
              </p>
              <div className="mt-8 mb-5 text-xl font-bold text-white dark:text-white">
                Contact Us
              </div>
              <p className="mb-3 linkify">
                If you have any questions about our Privacy Policy, please do
                not hesitate to contact us at{" "}
                <a href="mailto:wagmifund.lens@gmail.com">
                  wagmifund.lens@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacy;
