"use client"; //this component is for showing loading state of the form button

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";

interface FormButtonProps {
  children: React.ReactNode;
}

export default function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus(); //to use useFormStatus hook, we need to use it on another component and pass the button as a child

  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}
