import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/stocks/$ticker",
      params: { ticker: "AAPL" },
      search: { window: "60D", group: "pricemomentum" },
    });
  },
});
