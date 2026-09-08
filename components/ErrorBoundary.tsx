"use client";
import { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="border-red-200 bg-red-50 m-4 p-6">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="text-red-500 text-3xl" />
            <p className="font-semibold">Something went wrong!</p>
            <p className="text-sm text-muted-foreground">{this.state.error?.message}</p>
            <Button onClick={() => this.setState({ hasError: false, error: null })} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}
