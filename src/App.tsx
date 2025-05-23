import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'

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

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
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
    )
}