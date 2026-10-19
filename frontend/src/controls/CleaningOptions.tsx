import {FormControlLabel, Grid, Switch} from "@mui/material";
import {Tune as CleaningOptionsIcon} from "@mui/icons-material";
import React from "react";
import {
    useCarpetModeStateMutation,
    useCarpetModeStateQuery,
    useRepeatCleanStateMutation,
    useRepeatCleanStateQuery,
} from "../api";
import ControlsCard from "./ControlsCard";

interface ToggleOptionProps {
    label: string;
    useQuery: typeof useCarpetModeStateQuery;
    useMutation: typeof useCarpetModeStateMutation;
}

const ToggleOption = ({label, useQuery, useMutation}: ToggleOptionProps): React.ReactElement => {
    const {data, isFetching, isError} = useQuery();
    const {mutate, isPending} = useMutation();

    return (
        <FormControlLabel
            label={label}
            disabled={isFetching || isPending || isError || data === undefined}
            control={
                <Switch
                    size="small"
                    checked={data?.enabled ?? false}
                    onChange={(e) => {
                        mutate(e.target.checked);
                    }}
                />
            }
        />
    );
};

// Both settings are stored on the robot, so they stay as they were left for the next cleanup
const CleaningOptions = ({carpetMode, repeatClean}: {carpetMode: boolean; repeatClean: boolean}): React.ReactElement => {
    return (
        <ControlsCard icon={CleaningOptionsIcon} title="Cleaning options">
            <Grid container direction="column">
                {carpetMode && (
                    <ToggleOption label="Carpet mode" useQuery={useCarpetModeStateQuery} useMutation={useCarpetModeStateMutation}/>
                )}
                {repeatClean && (
                    <ToggleOption label="Double pass" useQuery={useRepeatCleanStateQuery} useMutation={useRepeatCleanStateMutation}/>
                )}
            </Grid>
        </ControlsCard>
    );
};

export default CleaningOptions;
