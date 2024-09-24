import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export function Settings() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link href="#" className="font-semibold text-primary">
            General
          </Link>
          <Link href="#">Security</Link>
          <Link href="#">Integrations</Link>
          <Link href="#">Support</Link>
          <Link href="#">Organizations</Link>
          <Link href="#">Advanced</Link>
        </nav>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Name</CardTitle>
              <CardDescription>
                Used to identify you in the FinalRound platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input placeholder="User Name" />
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interview Preferences</CardTitle>
              <CardDescription>
                Customize your interview simulation experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="audio" defaultChecked />
                  <label
                    htmlFor="audio"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable audio feedback during simulations
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="difficulty" />
                  <label
                    htmlFor="difficulty"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Increase difficulty progressively
                  </label>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
