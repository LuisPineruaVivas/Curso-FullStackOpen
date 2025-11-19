import type { CoursePart } from "../type";

interface ContentProps {
    courseParts: CoursePart[];
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};


const Content = (props: ContentProps) => {
  return (
    <div>
        {props.courseParts.map((part, index) => {
            switch(part.kind) {
                case "basic":
                    return <div key={index} style={{marginBottom: "15px"}}>
                        <p style={{fontWeight: "bold", margin: "0px" }}>{part.name} {part.exerciseCount}</p>
                        {part.description}
                        </div>;
                case "group":
                    return <div key={index} style={{marginBottom: "15px"}}>
                        <p style={{fontWeight: "bold", margin: "0px" }}>{part.name} {part.exerciseCount}</p>
                            Group Project count: {part.groupProjectCount}
                        </div> ;
                case "background":
                    return <div key={index} style={{marginBottom: "15px"}}>
                        <p style={{fontWeight: "bold", margin: "0px" }}>{part.name} {part.exerciseCount}</p>
                        <p style={{margin: "0px" }}>{part.description}</p>
                        <p style={{margin: "0px" }}>{part.backgroundMaterial}</p>
                        </div>;
                case "special":
                    return <div key={index} style={{marginBottom: "15px"}}>
                        <p style={{fontWeight: "bold", margin: "0px" }}>{part.name} {part.exerciseCount}</p>
                        <p style={{margin: "0px" }}>{part.description}</p>
                        <p style={{margin: "0px" }}>required skills: {part.requirements.join(", ")}</p>
                        </div>;
                default:
                    return assertNever(part);
            }
        })}
    </div>
  )
}

export default Content