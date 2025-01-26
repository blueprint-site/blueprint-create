import noImageSelected from "@/assets/backgrounds/noimage.png";
import "@/styles/schematicsupload.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../LoadingOverlays/LoadingSpinner";
import { LoadingSuccess } from "../LoadingOverlays/LoadingSuccess";
import supabase from "../utility/Supabase";

function SchematicsUpload() {
    const [uploadedImage, setUploadedImage] = useState<string>();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [gameVersion, setGameVersion] = useState<string>("");
    const [createVersion, setCreateVersion] = useState<string>("");
    const [loader, setLoader] = useState<string>("");
    const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(
        null
    );
    const [uploadedSchematic, setUploadedSchematic] = useState<File | null>(
        null
    );
    const [isSchematicUploaded, setIsSchematicUploaded] = useState<boolean>(
        false
    );
    const [isSchematicError, setIsSchematicError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showFinalMessage, setShowFinalMessage] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();
    const [userdata, setUserdata] = useState<any>();

    const getUserData = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        setUserdata(user); // Store the user data in the state
    };

    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                setShowFinalMessage(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
        if (uploadedImage) {
            return;
        } else {
            setUploadedImage(noImageSelected);
        }
    }, [loading]);

    useEffect(() => {
        if (showFinalMessage) {
            const redirectTimer = setTimeout(() => {
                navigate("/schematics");
            }, 500);

            return () => clearTimeout(redirectTimer);
        }
    }, [showFinalMessage, navigate]);

    useEffect(() => {
        getUserData();
        if (userdata) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            setUploadedImageFile(file);
            setUploadedImage(URL.createObjectURL(file));
        }
    }

    function handleSchematicChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            const fileExtension = file.name.split(".").pop()?.toLowerCase();

            if (fileExtension === "nbt") {
                setIsSchematicUploaded(true);
                setIsSchematicError(false);
                setUploadedSchematic(file);
                // Add further logic to handle the file upload if necessary
            } else {
                setIsSchematicUploaded(false);
                setIsSchematicError(true);
            }
        }
    }

    function handleUpload() {
        const missingFields = [];
        if (!uploadedImageFile) missingFields.push("Image File");
        if (!uploadedSchematic) missingFields.push("Schematic File");
        if (isSchematicError) missingFields.push("Valid Schematic File");
        if (!gameVersion) missingFields.push("Game Version");
        if (!createVersion) missingFields.push("Create Version");
        if (!loader) missingFields.push("Loader");
        if (!loggedIn) missingFields.push("Login");
        if (!description) missingFields.push("Description");
        if (!title) missingFields.push("Title");

        if (missingFields.length > 0) {
            alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
        } else {
            setLoading(true);
            handleSchematicUpload(
                uploadedSchematic,
                uploadedImageFile,
                title,
                description,
                userdata?.user_metadata?.custom_claims?.global_name
            );
        }
    }

    function handleCancel() {
        navigate("/schematics");
    }
    async function handleSchematicUpload(
        file: File,
        image: File,
        title: string,
        description: string,
        author: string
    ) {
        try {
            // Upload file to bucket
            const filePath = `files/${Date.now()}_${file.name}`;
            const {
                data: fileData,
                error: fileError,
            } = await supabase.storage
                .from("schematics")
                .upload(filePath, file);

            if (fileError) {
                console.log("FILE ERROR", fileError);
            }

            // Upload image to bucket
            const imagePath = `images/${Date.now()}_${image.name}`;
            const {
                data: imageData,
                error: imageError,
            } = await supabase.storage
                .from("schematics")
                .upload(imagePath, image);

            if (imageError) {
                console.log("IMAGE ERROR", imageError);
            }

            // Get public URLs
            const fileUrl = supabase.storage
                .from("schematics")
                .getPublicUrl(filePath).data.publicUrl;
            const imageUrl = supabase.storage
                .from("schematics")
                .getPublicUrl(imagePath).data.publicUrl;

            // Insert metadata into the table
            const {
                data: blueprintData,
                error: insertError,
            } = await supabase.from("schematics").insert([
                {
                    title: title,
                    description: description,
                    schematic_url: fileUrl,
                    image_url: imageUrl,
                    author: userdata?.user_metadata?.custom_claims?.global_name,
                    game_versions: gameVersion,
                    create_versions: createVersion,
                    modloader: loader,
                },
            ]);

            if (insertError) throw insertError;

            console.log("Blueprint uploaded successfully:", blueprintData);
        } catch (error) {
            console.error("Error uploading blueprint:", error);
        }
    }

    if (loading && !showFinalMessage) {
        return (
            <div className="loading">
                <LoadingSpinner />
                <h1>Your schematic is being uploaded!</h1>
                <h4>Wait some time</h4>
            </div>
        );
    }

    if (showFinalMessage) {
        return (
            <div className="final-message">
                <LoadingSuccess />
            </div>
        );
    }

    return (
        <div className="container">
            <div className="top-text-box">
                <h1 className="page-title">Let's upload a schematic!</h1>
            </div>
            <br />
            <div className="element-box">
                <img
                    src={uploadedImage}
                    alt="Image uploaded by the user"
                    className="uploaded-image"
                />
                <h2>Upload a screenshot for the schematic (1920x1080px)</h2>
                <h6 className="smol-text">
                    Suggestion: It should feature what is inside the schematic
                </h6>
                <label
                    htmlFor="uploadScreenshotButton"
                    className="upload-label"
                >
                    Choose File
                </label>
                <input
                    type="file"
                    id="uploadScreenshotButton"
                    hidden
                    onChange={handleChange}
                />
            </div>
            <br />
            <div className="element-box">
                <h2>Upload a schematic (.nbt)</h2>
                <h6 className="smol-text">
                    The exciting part! This is where you upload your .nbt file
                </h6>
                <label htmlFor="uploadSchematicButton" className="upload-label">
                    Choose File
                </label>
                <input
                    type="file"
                    id="uploadSchematicButton"
                    hidden
                    onChange={handleSchematicChange}
                />
                {isSchematicError && (
                    <h6 className="schematic-status-bad">
                        Remember! Only .nbt files are allowed
                    </h6>
                )}
                {isSchematicUploaded && (
                    <h6 className="schematic-status">Schematic uploaded!</h6>
                )}
            </div>
            <br />
            <div className="element-box">
                <h2>
                    Schematic autor:{" "}
                    <i>{userdata?.user_metadata?.custom_claims?.global_name}</i>
                </h2>
                <h6 className="smol-text">
                    The name of the person who uploaded the schematic. Set
                    automatically acording to your account
                </h6>
            </div>
            <br />
            <div className="element-box">
                <h2>Choose a title and a description</h2>
                <div className="input-group">
                    <h6>Choose a title for your schematic</h6>
                    <input
                        id="title"
                        type="text"
                        maxLength={100}
                        placeholder="Title"
                        className="title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <h6>Tell others what is inside it</h6>
                    <textarea
                        id="description"
                        placeholder="Description"
                        className="desc-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>
            <br />
            <div className="element-box">
                <h2>
                    Choose what version of <b>Minecraft</b> it is for
                </h2>
                <h6 className="smol-text">
                    The version of Minecraft the schematic is made for (the
                    minimum version it needs to run)
                </h6>
                <div className="input-group">
                    <div className="radio">
                        <input
                            type="radio"
                            id="1.20.1-mcversion"
                            name="mcversion"
                            value="1.20.1"
                            onChange={(e) => setGameVersion(e.target.value)}
                        />
                        <label
                            htmlFor="1.20.1-mcversion"
                            className="radio-version-label"
                        >
                            1.20.1
                        </label>
                    </div>
                    <div className="radio">
                        <input
                            type="radio"
                            id="1.19.2-mcversion"
                            name="mcversion"
                            value="1.19.2"
                            onChange={(e) => setGameVersion(e.target.value)}
                        />
                        <label
                            htmlFor="1.19.2-mcversion"
                            className="radio-version-label"
                        >
                            1.19.2
                        </label>
                    </div>
                    <div className="radio">
                        <input
                            type="radio"
                            id="1.18.2-mcversion"
                            name="mcversion"
                            value="1.18.2"
                            onChange={(e) => setGameVersion(e.target.value)}
                        />
                        <label
                            htmlFor="1.18.2-mcversion"
                            className="radio-version-label"
                        >
                            1.18.2
                        </label>
                    </div>
                </div>
            </div>
            <br />
            <div className="element-box">
                <h2>
                    Choose what version of <b>Create</b> it is for
                </h2>
                <h6 className="smol-text">
                    Create has different versions, choose one that the schematic
                    was made in (not sure?)
                </h6>
                <div className="input-group">
                    <div className="radio">
                        <input
                            type="radio"
                            id="0.5.1-createversion"
                            name="createversion"
                            value="0.5.1 (a-j)"
                            onChange={(e) => setCreateVersion(e.target.value)}
                        />
                        <label
                            htmlFor="0.5.1-createversion"
                            className="radio-version-label"
                        >
                            0.5.1 (a-j)
                        </label>
                    </div>
                    <div className="radio">
                        <input
                            type="radio"
                            id="0.5.0-createversion"
                            name="createversion"
                            value="0.5.0 (a-i)"
                            onChange={(e) => setCreateVersion(e.target.value)}
                        />
                        <label
                            htmlFor="0.5.0-createversion"
                            className="radio-version-label"
                        >
                            0.5.0 (a-i)
                        </label>
                    </div>
                </div>
            </div>
            <br />
            <div className="element-box">
                <h2>What mod loader is it for?</h2>
                <h6 className="smol-text">
                    Loader is a thing that allows your mods to run
                </h6>
                <div className="input-group">
                    <div className="radio">
                        <input
                            type="radio"
                            id="forge-loader"
                            name="loader"
                            value="Forge"
                            onChange={(e) => setLoader(e.target.value)}
                        />
                        <label
                            htmlFor="forge-loader"
                            className="radio-version-label"
                        >
                            Forge
                        </label>
                    </div>
                    <div className="radio">
                        <input
                            type="radio"
                            id="fabric-loader"
                            name="loader"
                            value="Fabric"
                            onChange={(e) => setLoader(e.target.value)}
                        />
                        <label
                            htmlFor="fabric-loader"
                            className="radio-version-label"
                        >
                            Fabric
                        </label>
                    </div>
                    <div className="radio">
                        <input
                            type="radio"
                            id="quilt-loader"
                            name="loader"
                            value="Quilt"
                            onChange={(e) => setLoader(e.target.value)}
                        />
                        <label
                            htmlFor="quilt-loader"
                            className="radio-version-label"
                        >
                            Quilt
                        </label>
                    </div>
                    <div className="radio">
                        <input
                            type="radio"
                            id="neo-forge-loader"
                            name="loader"
                            value="NeoForge"
                            onChange={(e) => setLoader(e.target.value)}
                        />
                        <label
                            htmlFor="neo-forge-loader"
                            className="radio-version-label"
                        >
                            NeoForge
                        </label>
                    </div>
                </div>
            </div>
            <br />
            <div className="element-box-buttons">
                <center>
                    <button className="cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="upload" onClick={handleUpload}>
                        Upload!
                    </button>
                </center>
            </div>
        </div>
    );
}

export default SchematicsUpload;
