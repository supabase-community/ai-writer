import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"
import * as v from "valibot"

const signinSchema = v.object({
  email: v.string("Your email must be a string.", [
    v.minLength(1, "Please enter your email."),
    v.email("Please enter a valid email address."),
  ]),
  password: v.string("Your password must be a string.", [
    v.minLength(1, "Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more."),
  ]),
})

export const signIn = async (formData: FormData) => {
  "use server"

  const email = (formData.get("email") as string).trim()
  const password = (formData.get("password") as string).trim()

  // Validate the form data
  try {
    v.parse(signinSchema, { email, password })
    // Handle errors if one occurs
  } catch (error) {
    if (error instanceof v.ValiError) {
      const message = error.message
      return redirect(`/signin?message=${message}`)
    }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect("/signin?message=Could not authenticate user")
  }

  return redirect("/reconcile")
}
