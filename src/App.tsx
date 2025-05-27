import {
    QueryClient,
    QueryClientProvider, useMutation,
    useQuery,
} from '@tanstack/react-query'
import {useActionState} from "react";
import {redirect} from "@tanstack/react-router";

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Students />
        </QueryClientProvider>
    )
}

function Students() {
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch('http://localhost:8080/students').then((res) =>
                res.json(),
            ),
    })

     const mutation = useMutation({
        mutationFn: (student: {name: string, grade: string}) =>
            fetch('http://localhost:8080/students', {
                    method: 'POST',
                    body: JSON.stringify(student)
                }
            )
    })

    const [_, submitAction] = useActionState(
        async (previousState, formData) => {
            mutation.mutate({name: formData.get("name"), grade: formData.get("grade")});
            return null;
        },
        null,
    );

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
        <div>
            <form action={submitAction}>
                <label htmlFor="name">Name</label>
                <input id="name" type="text"/>
                <label htmlFor="grade">Grade</label>
                <input id="grade" type="number"/>
                <button type="submit" id="submit">Submit</button>
            </form>
        </div>

        <div>
            <h1>Students</h1>
            <p>List of students</p>
            <table>
                {data.map((student) =>
                    <tr>
                        <td>ID: {student.id}</td>
                        <td>Name: {student.name}</td>
                        <td>Grade: {student.grade}</td>
                    </tr>)
                }
            </table>
        </div>
        </>
    )
}