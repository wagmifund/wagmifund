import { ApiNotificationType } from "@pushprotocol/restapi";
import { motion } from "framer-motion";
import { Loadable } from "./Loadable";
import { NotificationItem } from "./NotificationItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

export type NotificationFeedProps = {
  notifications?: ApiNotificationType[];
  spamNotifications?: ApiNotificationType[];
  notificationsIsLoading: boolean;
  spamNotificationsIsLoading: boolean;
};

export const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export function NotificationFeed({
  notifications,
  spamNotifications,
  notificationsIsLoading,
  spamNotificationsIsLoading,
}: NotificationFeedProps) {
  return (
    <Tabs defaultValue="inbox">
      <div className="flex justify-center">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="spam">Spam</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        className="h-96 overflow-y-scroll border-none px-0"
        value="inbox"
      >
        <Loadable isLoading={notificationsIsLoading}>
          <motion.div
            animate="show"
            initial="hidden"
            viewport={{ once: true }}
            whileInView="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {notifications?.length == 0 && (
              <>
                You currently have no notifications, try subscribing to some
                channels.
              </>
            )}
            {notifications?.map((notification, i) => {
              return (
                <motion.div
                  key={`inbox-${i}`}
                  variants={FADE_DOWN_ANIMATION_VARIANTS}
                >
                  <NotificationItem
                    app={notification.payload.data.app}
                    chainName={notification.source as any}
                    cta={notification.payload.data.acta}
                    icon={notification.payload.data.icon}
                    image={notification.payload.data.aimg}
                    notificationBody={notification.payload.data.amsg}
                    notificationTitle={notification.payload.data.asub}
                    theme={"light"}
                    url={notification.payload.data.url}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </Loadable>
      </TabsContent>
      <TabsContent
        className="h-96 overflow-y-scroll border-none px-0"
        value="spam"
      >
        <Loadable isLoading={spamNotificationsIsLoading}>
          <motion.div
            animate="show"
            initial="hidden"
            viewport={{ once: true }}
            whileInView="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {spamNotifications?.length == 0 && (
              <>You currently have no spam notifications</>
            )}
            {spamNotifications?.map((notification, i) => {
              return (
                <motion.div
                  key={`spam-${i}`}
                  variants={FADE_DOWN_ANIMATION_VARIANTS}
                >
                  <NotificationItem
                    app={notification.payload.data.app}
                    chainName={notification.source as any}
                    cta={notification.payload.data.acta}
                    icon={notification.payload.data.icon}
                    image={notification.payload.data.aimg}
                    notificationBody={notification.payload.data.amsg}
                    notificationTitle={notification.payload.data.asub}
                    theme={"light"}
                    url={notification.payload.data.url}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </Loadable>
      </TabsContent>
    </Tabs>
  );
}
