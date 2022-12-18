import AppearAnimation from "./AnimatedAppear";
import { Form, useZodForm } from "./Form";
import Select from "./Select";
import { useEffect, useState } from "react";
import { object, number, string, array } from "zod";
import StepWizard from "./StepWizard";
import { Card } from "./Card";
import { SUPPORTED_CURRENCIES } from "@utils/constants";
import Input from "./Input";
import Button from "./Button";
import React from "react";
import MockTierCard from "./MockTierCard";
import { LoaderIcon } from "react-hot-toast";
import { useAppStore } from "@store/app";

const Tier = ({
  onClick,
  field,
  activeTier,
  index,
  setTiersFields,
  fieldsData,
}) => {
  const form = useZodForm({
    schema: object({
      amount: number().lt(100),
      comment: string(),
      currency: string(),
      emoji: string(),
    }),
    defaultValues: field,
  });
  const [comment, amount, currency, emoji] = form.watch([
    "comment",
    "amount",
    "currency",
    "emoji",
  ]);

  //   use this for loading state
  const isLoading = false;
  const [fields, setFields] = useState(fieldsData);
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffect(() => {
    const newTiersData = [
      // Items before the insertion point:
      ...fieldsData.slice(0, activeTier),
      // New item:
      { comment, amount, currency, emoji },
      // Items after the insertion point:
      ...fieldsData.slice(activeTier + 1),
    ];
    setFields(newTiersData);
    setTiersFields(newTiersData);
  }, [comment, amount, currency, emoji]);

  return (
    <div className="flex justify-between w-full">
      <div className="w-1/2">
        <Form
          form={form}
          onSubmit={(formData) => {
            onClick(formData);
          }}
        >
          <AppearAnimation className="flex-grow rounded-2xl w-full">
            <Card className=" bg-gray-900 w-full">
              <div className="form-control w-full max-w-md mx-auto">
                <label className="label">
                  <span className="label-text text-white">Currency</span>
                </label>
                <Select
                  className="text-white"
                  options={SUPPORTED_CURRENCIES.map(
                    ({ name, address, symbol }) => ({
                      name,
                      symbol,
                      currency: address,
                      label: name,
                    })
                  )}
                  onChange={(e: { currency: string }) => {
                    form.setValue("currency", e.currency);
                  }}
                  selected
                  defaultValue={
                    SUPPORTED_CURRENCIES.map(({ name, symbol, address }) => ({
                      name,
                      symbol,
                      currency: address,
                      label: name,
                    }))[0]
                  }
                />
              </div>
              <Input
                type="number"
                label="Amount"
                placeholder="5 MATIC"
                {...form.register(`amount`, {
                  valueAsNumber: true,
                  required: true,
                })}
              />
              <Input
                type="text"
                label="Comment"
                placeholder="Thanks for supporting with 5 MATIC"
                {...form.register(`comment`)}
              />
              <Input
                type="text"
                label="Emoji"
                placeholder="💰"
                {...form.register(`emoji`)}
              />
              <div className="flex">
                <Button
                  disabled={isLoading}
                  type="submit"
                  variant="primary"
                  className="mx-auto mt-3 max-w-xs"
                >
                  {isLoading && <LoaderIcon className="mr-2 h-4 w-4" />} add
                  more new tiers
                </Button>

                {activeTier >= 2 ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      onClick(form.getValues());
                    }}
                    className="mx-auto mt-3 max-w-xs"
                  >
                    {isLoading && <LoaderIcon className="mr-2 h-4 w-4" />}
                    continue to with existing tiers
                  </Button>
                ) : (
                  <React.Fragment />
                )}
              </div>
            </Card>
          </AppearAnimation>
        </Form>
      </div>
      <MockTierCard
        currency={currency}
        activeTier={activeTier}
        tiers={fields}
        handle={currentProfile?.handle}
      />
    </div>
  );
};

const TierForm = () => {
  const [fields, setFields] = useState([
    {
      amount: 1,
      comment: "",
      currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
    },
    {
      amount: 2,
      comment: "",
      currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
    },
    {
      amount: 5,
      comment: "",
      currency: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      emoji: "💰",
    },
  ]);
  const [activeTier, setActiveTier] = useState(0);

  return (
    <StepWizard
      className="w-full"
      stages={fields.map((field, index) => (
        <Tier
          setTiersFields={setFields}
          //   isLoading={true}
          activeTier={activeTier}
          key={`tier-${index}`}
          index={index}
          fieldsData={fields}
          field={field}
          onClick={(e) => {
            console.log("onclick", e);
            setActiveTier((currentTier) => currentTier + 1);
          }}
        />
      ))}
      activeIndex={activeTier}
    />
  );
};

export default TierForm;
