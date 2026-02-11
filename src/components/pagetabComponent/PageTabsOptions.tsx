import { SideTitleOptionComponent } from "../titles/SideTitleOption.component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Show } from "../show/Show.component";

interface Props {
  title?: string;
  children: React.ReactNode[] | React.ReactNode;
  subtitle?: string;
  valueTab?: string[];
}

export const PageTabOption = ({
  title,
  subtitle,
  children,
  valueTab,
}: Props) => {
  return (
    <Tabs defaultValue={valueTab ? valueTab[0] : ""} className="w-full">
      <SideTitleOptionComponent
        title={title}
        subtitle={subtitle}
        actionChildren={[]}
      >
        <TabsList className="grid min-w-20 max-w-80 grid-cols-2 mb-6 justify-center">
          <Show when={!!valueTab} fallback={null}>
            {valueTab?.map((value) => (
              <TabsTrigger value={value || ""} key={value}>
                {value}
              </TabsTrigger>
            ))}
          </Show>
        </TabsList>
      </SideTitleOptionComponent>
      <Show when={!!valueTab} fallback={null}>
        {Array.isArray(children) ? (
          valueTab?.map((value, index) => (
            <TabsContent value={value}>{children[index]}</TabsContent>
          ))
        ) : (
          <TabsContent value={valueTab ? valueTab[0] : ""}>
            {children}
          </TabsContent>
        )}
      </Show>
    </Tabs>
  );
};
