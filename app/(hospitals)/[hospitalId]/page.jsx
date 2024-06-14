import { useRouter } from "next/router";
import { useDocument } from ""

export default function HospitalAdminDasboard ({params}) {

  const router = useRouter();
  const { hospitalId } = router.query;
  const [hospitalData, loading, error] = useDocument(
    firestore.doc(`hospitals/${hospitalId}`)
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!hospitalData.exists) {
    return <div>No such hospital!</div>;
  }

  const data = hospitalData.data();

  return(
    <div>
    <h1>Welcome to {data.name}</h1>
    <p>{data.address}</p>
  </div>
  )
}