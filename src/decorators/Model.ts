export default function Model() {
    return (target: any) => {
        const metadata = Reflect.getMetadata('design:type', target, 'firstName');

        console.log(metadata);
    }
}