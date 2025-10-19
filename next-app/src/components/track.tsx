"use client";

import {
	motion,
	useScroll,
	useTransform,
	useSpring,
	useMotionValue,
	useMotionValueEvent,
	MotionValue,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";

const Skiper19 = () => {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: ref });

	// Reset scroll position to top on component mount (page refresh)
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<section
			ref={ref}
			className="mx-auto flex h-[600vh] w-screen flex-col items-center overflow-hidden bg-[#729F4F] text-[#1F3A4B]"
		>
			<LinePath scrollYProgress={scrollYProgress} />
		</section>
	);
};

export { Skiper19 };

const LinePath = ({
	scrollYProgress,
}: {
	scrollYProgress: MotionValue<number>;
}) => {
	const pathRef = useRef<SVGPathElement>(null);

	// Motion values for camera
	const camX = useMotionValue<number>(0);
	const camY = useMotionValue<number>(0);
	const rotation = useMotionValue(0); // rotation of the icon

	// State for modal visibility
	const [modal20, setModal20] = useState(false);
	const [modal40, setModal40] = useState(false);
	const [modal60, setModal60] = useState(false);
	const [modal80, setModal80] = useState(false);

	// Track which modals have been shown to prevent re-showing
	const [shownModals, setShownModals] = useState({
		modal20: false,
		modal40: false,
		modal60: false,
		modal80: false,
	});

	// Window size
	const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
	useEffect(() => {
		const handleResize = () =>
			setWindowSize({ w: window.innerWidth, h: window.innerHeight });
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Smooth camera movement
	const smoothX = useSpring(camX, { stiffness: 400, damping: 30 });
	const smoothY = useSpring(camY, { stiffness: 400, damping: 30 });

	// Update camera and icon rotation as path progresses
	const lookAhead = -15;
	useMotionValueEvent(scrollYProgress, "change", (v: number) => {
		if (!pathRef.current) return;

		console.log("scroll progress:", v);

		// Check which modals should be shown based on scroll progress
		// Only show each modal once by checking if it has been shown before

		// 20% progress modal (19-21% range)
		if (v >= 0.19 && v <= 0.21 && !shownModals.modal20) {
			setModal20(true);
			setShownModals((prev) => ({ ...prev, modal20: true }));
		}

		// 40% progress modal (39-41% range)
		if (v >= 0.39 && v <= 0.41 && !shownModals.modal40) {
			setModal40(true);
			setShownModals((prev) => ({ ...prev, modal40: true }));
		}

		// 60% progress modal (59-61% range)
		if (v >= 0.59 && v <= 0.61 && !shownModals.modal60) {
			setModal60(true);
			setShownModals((prev) => ({ ...prev, modal60: true }));
		}

		// 80% progress modal (79-81% range)
		if (v >= 0.79 && v <= 0.81 && !shownModals.modal80) {
			setModal80(true);
			setShownModals((prev) => ({ ...prev, modal80: true }));
		}

		const path = pathRef.current;
		const totalLen = path.getTotalLength();

		// current scroll position along the path
		const currentLen = v * totalLen;

		// point slightly ahead of current position
		const pt = path.getPointAtLength(
			Math.min(currentLen + lookAhead, totalLen)
		);

		// for rotation, still sample a tiny bit further
		const nextPt = path.getPointAtLength(
			Math.min(currentLen + lookAhead + 1, totalLen)
		);

		camX.set(pt.x);
		camY.set(pt.y);

		// Compute angle in degrees
		const angle =
			Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);
		rotation.set(angle);

		carX.set(pt.x - 12.5);
		carY.set(pt.y - 12.5);
	});

	// Camera transforms
	const translateX = useTransform(
		smoothX,
		(x) => (-x + windowSize.w / 2.2) * 35
	);
	const translateY = useTransform(
		smoothY,
		(y) => (-y + windowSize.h / 1.9) * 30
	);

	// Path draw progress
	const pathLength = useTransform(scrollYProgress, [0.01, 1], [0.01, 1]);
	const dashOffset = useTransform(pathLength, (v) => 0.2 - v);

	//const iconX = useTransform(smoothX, (x) => (-x + windowSize.w / 2.2) * 1);
	//const iconY = useTransform(smoothY, (y) => (-y + windowSize.h / 1.9) * 1);

	// Center the car image
	const carX = useMotionValue(0);
	const carY = useMotionValue(0);
	const iconX = useTransform(carX, (x) => x - 20);
	const iconY = useTransform(carY, (y) => y - 20);

	const bgTranslateX = useTransform(
		smoothX,
		(x) => (-x + windowSize.w / 2.2) * 30
	); // slightly slower
	const bgTranslateY = useTransform(
		smoothY,
		(y) => (-y + windowSize.h / 1.9) * 25
	);

	return (
		<>
			{/* 20% Progress Modal */}
			{modal20 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<AlertDialog open={modal20} onOpenChange={setModal20}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>20% Progress Reached!</AlertDialogTitle>
								<AlertDialogDescription>
									You're making great progress on your journey! Current
									progress: {Math.round(scrollYProgress.get() * 100)}%
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogAction onClick={() => setModal20(false)}>
									Continue Journey
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}

			{/* 40% Progress Modal */}
			{modal40 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<AlertDialog open={modal40} onOpenChange={setModal40}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Halfway There!</AlertDialogTitle>
								<AlertDialogDescription>
									You've reached 40% of your journey. Keep going! Current
									progress: {Math.round(scrollYProgress.get() * 100)}%
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogAction onClick={() => setModal40(false)}>
									Keep Going
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}

			{/* 60% Progress Modal */}
			{modal60 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<AlertDialog open={modal60} onOpenChange={setModal60}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Over Halfway!</AlertDialogTitle>
								<AlertDialogDescription>
									Excellent progress! You're 60% through your journey. Current
									progress: {Math.round(scrollYProgress.get() * 100)}%
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogAction onClick={() => setModal60(false)}>
									Almost There!
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}

			{/* 80% Progress Modal */}
			{modal80 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<AlertDialog open={modal80} onOpenChange={setModal80}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Almost Complete!</AlertDialogTitle>
								<AlertDialogDescription>
									You're almost at the end! Just 20% more to go. Current
									progress: {Math.round(scrollYProgress.get() * 100)}%
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogAction onClick={() => setModal80(false)}>
									Finish Strong!
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}
			<svg
				width="2400"
				height="2400"
				viewBox="16000 5000 1500 3000"
				fill="none"
				overflow="visible"
				xmlns="http://www.w3.org/2000/svg"
				className="fixed inset-0 h-screen w-screen"
			>
				<motion.g
					style={{
						translateX,
						translateY,
						scale: 33,
					}}
				>
					{/* The path */}
					<motion.path
						ref={pathRef}
						d="M185.493 300.001H429.993C467.993 300.001 471.993 240.501 429.993 240.501H407.722C406.903 240.501 406.086 240.442 405.276 240.325L402.211 239.88C364.512 234.418 363.54 180.357 401.018 173.543C403.002 173.182 405.014 173.001 407.031 173.001H429.993C440.159 171.834 460.493 163.101 460.493 137.501C460.493 111.901 460.493 104.167 460.493 103.501C459.826 94.1675 454.5 77.0008 432.493 77.0008C406.867 77.7125 392.635 77.5001 392.635 63.5003C392.635 49.5005 404.914 46.5005 432.493 46.5005C448.356 46.5005 461.01 35.1057 460.634 23.5C460.634 9.5 451 1.50045 432.493 1.50045H287.493C277.819 1.5003 265.799 3.3076 259.631 16C255.5 24.5 256.733 37.6289 280.993 49.5005L362.566 84.6583C366.154 86.2046 369.403 88.4406 372.128 91.2394C392.856 112.524 373.411 146.359 345.111 137.315C335.552 134.26 326.462 131.119 318.5 128C274.07 110.598 214.993 77.0003 214.993 77.0003C208.826 74.167 193.493 64.575 193.493 48.0003C193.493 28.0003 193.493 1.50045 156.493 1.50045H35.9926C15.0014 -0.999697 -14.8074 24.8003 19.9926 48.0003L198.501 132C234.5 145.5 215.201 198.5 170.001 178.5L44.0014 127C33.0014 122 9.40137 118.1 3.00137 142.5C-4.99863 173 13.0014 211.5 49.0014 210.5C77.8014 209.7 174 210.167 218.5 210.5C230 210.167 253.6 204.7 256 185.5C259 161.5 273 151.5 289 151.5C299.673 151.993 313.803 153.646 322.5 163.5C332.842 178.339 340.127 213.432 303.147 232.317C294.149 236.912 283.87 238 273.766 238C191.245 238 41 238 41 238C-1.5 238 -15.8 300.001 41 300.001H176.5"
						stroke="#363b41"
						strokeWidth="20"
						style={{
							pathLength,
							strokeDashoffset: dashOffset,
						}}
					/>
					{/* The moving and rotating image */}
					{pathRef.current && (
						<motion.image
							href="/camrytopdown.png" // your image here
							x={carX}
							y={carY}
							width={25}
							height={25}
							style={{
								rotate: rotation,
								originX: 0.5, // rotate around center
								originY: 0.5,
							}}
						/>
					)}
				</motion.g>
			</svg>
		</>
	);
};
