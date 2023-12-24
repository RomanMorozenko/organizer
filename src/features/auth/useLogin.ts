import { LoginParamsType } from "common/api/todolists-api";
import { FormikHelpers, useFormik } from "formik";
import { authThunks } from "./auth.reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";


export const useLogin = () => {

    const dispatch = useAppDispatch();

    const formik = useFormik({
        validate: (values) => {
          if (!values.email) {
            return {
              email: "Email is required",
            };
          }
          if (!values.password) {
            return {
              password: "Password is required",
            };
          }
        },
        initialValues: {
          email: "",
          password: "",
          rememberMe: false,
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
          dispatch(authThunks.loginTC({ data: values }))
            .unwrap()
            .catch((err:any) => {
              if (err.fieldsErrors.length) {
                const { fieldsErrors } = err;
                formikHelpers.setFieldError(fieldsErrors[0].field, fieldsErrors[0].error)
              }
            })
        },
      });

      return {formik}
}