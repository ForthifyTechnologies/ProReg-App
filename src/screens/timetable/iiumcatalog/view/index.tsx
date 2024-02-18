import HeaderButton from "@/components/header/button";
import List from "@/components/list";
import useTimetable from "@/hooks/useTimetable";
import { styles } from "@/styles";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";

export default function ViewCatalogScreen({
	navigation,
	route,
}: {
	navigation: any;
	route: any;
}) {
	// Title
	const [title, setTitle] = useState("");
	const [abbreviation, setAbbreviation] = useState("");

	// Days & Time
	const [days, setDays] = useState<number[]>([]);
	const [start, setStart] = useState("08:00");
	const [end, setEnd] = useState("09:00");

	// Style
	const [color, setColor] = useState<string | null>(null);

	// Details (Optional)
	const [courseCode, setCourseCode] = useState("");
	const [section, setSection] = useState<number | null>(null);
	const [creditHours, setCreditHours] = useState<number | null>(null);
	const [lecturer, setLecturer] = useState("");
	const [venue, setVenue] = useState("");

	// Context
	const { timetable, addSchedule: addScheduleContext } = useTimetable();

	useEffect(() => {
		// console.log(route.params.schedule);
		// Set default values
		const schedule: Schedule = route.params.schedule;
		setTitle(schedule.title);
		setAbbreviation(schedule.code || schedule.abbreviation || "");
		setDays(schedule.weekTimes.map((x) => x.day));
		setStart(schedule.weekTimes[0].start);
		setEnd(schedule.weekTimes[0].end);
		setColor(schedule.color || null);
		setCourseCode(schedule.code || "");
		setSection(schedule.section || null);
		setCreditHours(schedule.creditHours || null);
		setLecturer(schedule.lecturer?.[0] || "");
		setVenue(schedule.venue || "");
	}, [route.params.schedule]);

	useEffect(() => {
		// Setup header buttons
		navigation.setOptions({
			headerLeft: () => (
				<HeaderButton title="Cancel" onPress={navigation.goBack} />
			),
			headerRight: () => (
				<HeaderButton
					title="Add"
					bold
					disabled={!validate()}
					onPress={addSchedule}
				/>
			),
		});
	}, [navigation]);

	function validate() {
		if (title === "") return false;

		// Check if title is unique
		if (
			timetable?.schedules.find(
				(x) => x.title.toLowerCase() === title.toLowerCase(),
			)
		)
			return false;

		if (days.length === 0) return false;

		if (color === null) return false;

		// Check if start and end times are valid
		// Following the format HH:mm
		// And check if end time is after start time
		const startMoment = moment(start, "HH:mm");
		const endMoment = moment(end, "HH:mm");
		if (!startMoment.isValid()) return false;
		if (!endMoment.isValid()) return false;
		if (!endMoment.isAfter(startMoment)) return false;

		// TODO: Check if schedule is clashing with other courses

		return true;
	}

	function addSchedule() {
		if (!validate()) return;

		const newSchedule: Schedule = {
			code: courseCode,
			title: title,
			abbreviation: abbreviation,
			section: section || undefined,
			creditHours: creditHours || undefined,
			lecturer: [lecturer],
			venue: venue,
			color: color || undefined,
			weekTimes: days.map((d) => ({
				day: d,
				start: start,
				end: end,
			})),
		};

		addScheduleContext(newSchedule);
		navigation.navigate("Timetable");
	}

	return (
		<ScrollView
			style={[styles.container, { backgroundColor: colors.zinc[900] }]}
			contentInsetAdjustmentBehavior="automatic"
		>
			{/* Title */}
			<List lighter title="Title">
				<List.TextInput
					title="Course Name"
					value={title}
					onChangeText={setTitle}
				/>
			</List>

			{/* Abbreviation */}
			<List
				lighter
				title="Abbreviation (Optional)"
				footer="This will be used to display the course name in the timetable."
			>
				<List.TextInput
					title={
						title === ""
							? "Course Name in Short Form"
							: title
									.split(" ")
									.map((x) => x[0])
									.join("")
					}
					value={abbreviation}
					onChangeText={setAbbreviation}
				/>
			</List>

			{/* Days & Time */}
			<List lighter title="Days & Time">
				<List.Base title="Days">
					<View
						style={{
							flexDirection: "row",
						}}
					>
						{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
							<TouchableOpacity
								key={i}
								style={{
									width: 32,
									height: 32,
									borderRadius: 1000,
									borderColor: days.includes(i)
										? colors.lime[500]
										: colors.zinc[700],
									borderWidth: 1,
									marginLeft: 4,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: days.includes(i)
										? colors.lime[500] + "80"
										: undefined,
								}}
								onPress={() =>
									setDays((days) =>
										days.includes(i)
											? days.filter((x) => x !== i)
											: [...days, i],
									)
								}
							>
								<Text style={{ color: "white" }}>{d}</Text>
							</TouchableOpacity>
						))}
					</View>
				</List.Base>

				<List.DateTimePicker
					mode="time"
					title="Start Time"
					value={moment(start, "HH:mm").toDate()}
					onChange={(x) => {
						// Add one hour to end time if it is before start time
						const endMoment = moment(end, "HH:mm");
						if (!endMoment.isAfter(moment(x, "HH:mm"))) {
							setEnd(moment(x).add(1, "hour").format("HH:mm"));
						}
						setStart(moment(x).format("HH:mm"));
					}}
				/>
				<List.DateTimePicker
					mode="time"
					title="End Time"
					value={moment(end, "HH:mm").toDate()}
					onChange={(x) => {
						// Subtract one hour from start time if it is after end time
						const startMoment = moment(start, "HH:mm");
						if (!startMoment.isBefore(moment(x, "HH:mm"))) {
							setStart(moment(x).subtract(1, "hour").format("HH:mm"));
						}
						setEnd(moment(x).format("HH:mm"));
					}}
				/>
			</List>

			{/* Style */}
			<List lighter title="Style">
				<List.Base title="Color">
					<View
						style={{
							flexDirection: "column",
						}}
					>
						{[
							["slate", "red", "orange", "yellow", "lime"],
							["emerald", "sky", "indigo", "violet", "pink"],
						].map((cs, i) => (
							<View
								key={i}
								style={{
									flexDirection: "row",
									marginTop: i === 0 ? 0 : 2,
								}}
							>
								{cs.map((c, i) => (
									<TouchableOpacity
										key={i}
										style={{
											borderColor:
												color === c ? colors.lime[500] : "transparent",
											borderRadius: 1000,
											borderWidth: 2,
											padding: 2,
											marginLeft: 2,
										}}
										onPress={() => setColor(c)}
									>
										<View
											style={{
												width: 32,
												height: 32,
												borderRadius: 1000,
												// @ts-ignore
												borderColor: colors[c][500],
												borderWidth: 1,
												alignItems: "center",
												justifyContent: "center",
												// @ts-ignore
												backgroundColor: colors[c][500] + "80",
											}}
										>
											<Text style={{ color: "white" }}>Aa</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>
						))}
					</View>
				</List.Base>
			</List>

			{/* Details (Optional) */}
			<List lighter title="Details (Optional)">
				<List.TextInput
					prompt
					title="Course Code"
					value={courseCode}
					onChangeText={setCourseCode}
				/>
				<List.TextInput
					prompt
					title="Section"
					value={section?.toString() ?? ""}
					onChangeText={(x) => setSection(x === "" ? null : parseInt(x))}
					keyboardType="numeric"
				/>
				<List.TextInput
					prompt
					title="Credit Hours"
					value={creditHours?.toString() ?? ""}
					onChangeText={(x) => setCreditHours(x === "" ? null : parseInt(x))}
					keyboardType="numeric"
				/>
				<List.TextInput
					prompt
					title="Lecturer"
					value={lecturer}
					onChangeText={setLecturer}
				/>
				<List.TextInput
					prompt
					title="Venue"
					value={venue}
					onChangeText={setVenue}
				/>
			</List>
		</ScrollView>
	);
}
