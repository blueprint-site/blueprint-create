import type { ComponentType } from "react";
import React, { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Home from "../pages/Home/Home";
import BaseLayout  from "@/layouts/BaseLayout";

export const routes: RouteObject[] = [
	{
		element: <BaseLayout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
		],
	},
];
