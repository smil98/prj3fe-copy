import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

export const Breadcrumbs = ({ pathSegments, navigate }) => {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} size="xs" />
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathSegments.map((segment, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink
            onClick={() =>
              navigate(`/${pathSegments.slice(0, index + 1).join("/")}`)
            }
            fontSize="sm"
          >
            {segment}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
