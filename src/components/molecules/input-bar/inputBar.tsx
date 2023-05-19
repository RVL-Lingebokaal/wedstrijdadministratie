import {
  FieldValues,
  Path,
  ControllerProps,
  useFormContext,
  Controller,
} from "react-hook-form";
import { FormInputLabel, Label, StyledFormControl } from "./inputBar.styles";

interface InputBarProps<T extends FieldValues> {
  label?: string;
  path: Path<T>;
  render: ControllerProps<T>["render"];
}

export default function InputBar<T extends FieldValues>({
  label,
  path,
  render,
}: InputBarProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormInputLabel htmlFor={path}>
      <Controller
        name={path}
        control={control}
        render={(field) => (
          <StyledFormControl>
            {label && <Label>{label}</Label>}
            {render(field)}
          </StyledFormControl>
        )}
      />
    </FormInputLabel>
  );
}

// <>
//     <FormInputControl>
//         <LabelContainer>
//             <FormName>
//                 {label}
//                 {required && <RequiredStar />}
//             </FormName>
//             {explanation && <FormHelperText>{explanation}</FormHelperText>}
//         </LabelContainer>
//         <InputContainer>{render(field)}</InputContainer>
//     </FormInputControl>
//     {field.fieldState.error?.message && (
//         <ErrorLabel>{field.fieldState.error.message}</ErrorLabel>
//     )}
// </>
