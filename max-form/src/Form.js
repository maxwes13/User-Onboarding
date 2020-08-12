import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

export default function Form() {


      const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: ""
      });

      const [serverError, setServerError] = useState("");

      const [buttonDisabled, setButtonDisabled] = useState(true);
      
      
      const [errors, setErrors] = useState({
        name: "", 
        email: "",
        password: "",
        terms: ""
      });
      
      const [post, setPost] = useState([]);

      const validateChange = (e) => {

        yup
          .reach(formSchema, e.target.name)
          .validate(e.target.name === "terms" ? e.target.checked : e.target.value) 
          .then((valid) => {
      
            setErrors({
              ...errors,
              [e.target.name]: ""
            });
          })
          .catch((err) => {
            console.log(err);
      
            setErrors({
              ...errors,
              [e.target.name]: err.errors[0]
            });
          });
      };
      
        const formSubmit = e => {
            e.preventDefault();
            console.log("it's submitted");
       
        axios
          .post("https://reqres.in/api/users", formState)
          .then((res) => {
            console.log("success!", res.data);
            setPost(res.data);
      
            setServerError(null); 
      
            setFormState({
              name: "",
              email: "",
              password: "",
              terms: true
            });
          })
          .catch((err) => {
          
            setServerError("oops! something happened!");
          });
        };
      
        const inputChange = (e) => {
            e.persist(); 
            console.log("input changed!", e.target.value);
            const newFormData = {
              ...formState,
              [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
            };
          
            validateChange(e); 
            setFormState(newFormData); 
          };

          const formSchema = yup.object().shape({
            name: yup.
            string().
            required("Name is required, bruh"),

            email: yup
              .string()
              .email("Get yo email right")
              .required("You gotta have yo email"),

            password: yup
            .string()
            .min(6, "6 character password brudda.")
            .required("Bruh, we need a password"),

            terms: yup.
            boolean().
            oneOf([true], "Just check the darn box")
          });

          useEffect(() => {
            formSchema.isValid(formState).then((isValid) => {
              
              setButtonDisabled(!isValid); 
            });
          }, [formState]);

        return (
        <form onSubmit={formSubmit}>
                {serverError ? <p className="error">{serverError}</p> : null}

            <label htmlFor="nameInput">
              Name
              <input id="nameInput" type="name" name="name" placeholder="Name" value={formState.name} onChange={inputChange} />
              {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>
            <label htmlFor="emailInput">
              E-mail
              <input id="emailInput" type="email" name="email" placeholder="Email" value={formState.email} onChange={inputChange}/>
              {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
            </label>
            <label htmlFor="passwordInput">
              Password
              <input id="passwordInput" type="password" name="password" placeholder="Password" value={formState.password} onChange={inputChange} />
              {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
            </label>
            <label htmlFor="termsInput">
              Do you agree to the terms and conditions?
              <input id="termsInput" type="checkbox" name="terms" />
              {errors.terms.length > 0 ? <p className="error">{errors.terms}</p> : null}
            </label>
            <button disabled={buttonDisabled} type="submit">
              Submit
            </button>
            <pre>{JSON.stringify(post, null, 2)}</pre>
          </form>
        );
}